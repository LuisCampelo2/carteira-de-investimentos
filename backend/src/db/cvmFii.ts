import AdmZip from 'adm-zip'

// CNPJ de cada FII, confirmado manualmente cruzando o Codigo_ISIN do arquivo
// da CVM (ex: BRHGLGCTF004 contém "HGLG") com o CNPJ_Fundo_Classe — nomes de
// fundo variam/mudam ao longo do tempo, então casar pelo ISIN (que embute o
// ticker) é mais confiável do que tentar casar pelo nome.
export const FII_CNPJ_BY_ID: Record<string, string> = {
  hglg11: '11.728.688/0001-47',
  knri11: '12.005.956/0001-65',
  mxrf11: '97.521.225/0001-25',
  gare11: '37.295.919/0001-60',
  xpml11: '28.757.546/0001-00',
  visc11: '17.554.274/0001-25',
  btlg11: '11.839.593/0001-09',
  kncr11: '16.706.958/0001-32',
}

export interface CvmFiiYield {
  yieldPercent: number
  referenceMonth: string
}

// Baixa o "Informe Mensal" que os FIIs são obrigados a enviar à CVM e extrai
// o rendimento distribuído (Percentual_Dividend_Yield_Mes) do mês mais
// recente já reportado — dado público oficial, sem custo. Só cobre os FIIs
// listados em FII_CNPJ_BY_ID; não tenta adivinhar CNPJ para os demais.
export async function fetchCvmFiiYields(): Promise<Record<string, CvmFiiYield>> {
  const year = new Date().getFullYear()
  const url = `https://dados.cvm.gov.br/dados/FII/DOC/INF_MENSAL/DADOS/inf_mensal_fii_${year}.zip`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CVM respondeu ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())

  const zip = new AdmZip(buffer)
  const entry = zip.getEntries().find((e) => e.entryName === `inf_mensal_fii_complemento_${year}.csv`)
  if (!entry) throw new Error('arquivo complemento não encontrado no zip da CVM')

  // O CSV da CVM vem em ISO-8859-1 (Latin-1), não UTF-8.
  const csv = entry.getData().toString('latin1')
  const lines = csv.split('\n')
  const header = lines[0].split(';')
  const cnpjIdx = header.indexOf('CNPJ_Fundo_Classe')
  const dateIdx = header.indexOf('Data_Referencia')
  const yieldIdx = header.indexOf('Percentual_Dividend_Yield_Mes')
  if (cnpjIdx === -1 || dateIdx === -1 || yieldIdx === -1) {
    throw new Error('colunas esperadas não encontradas no CSV da CVM')
  }

  // Para cada CNPJ que nos interessa, guarda só a linha de referência mais recente.
  const latestByCnpj = new Map<string, { referenceMonth: string; yieldPercent: number }>()
  const wantedCnpjs = new Set(Object.values(FII_CNPJ_BY_ID))
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    const cols = line.split(';')
    const cnpj = cols[cnpjIdx]
    if (!wantedCnpjs.has(cnpj)) continue
    const referenceMonth = cols[dateIdx]
    const yieldValue = Number(cols[yieldIdx])
    if (!referenceMonth || Number.isNaN(yieldValue)) continue
    const current = latestByCnpj.get(cnpj)
    if (!current || referenceMonth > current.referenceMonth) {
      latestByCnpj.set(cnpj, { referenceMonth, yieldPercent: yieldValue * 100 })
    }
  }

  const result: Record<string, CvmFiiYield> = {}
  for (const [id, cnpj] of Object.entries(FII_CNPJ_BY_ID)) {
    const found = latestByCnpj.get(cnpj)
    if (found) result[id] = found
  }
  return result
}
