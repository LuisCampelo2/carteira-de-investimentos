import type { Aula } from './types'
import { aula1 } from './aulas/aula1'
import { aula2 } from './aulas/aula2'
import { aula3 } from './aulas/aula3'
import { aula4 } from './aulas/aula4'
import { aula5 } from './aulas/aula5'
import { aula6 } from './aulas/aula6'
import { aula7 } from './aulas/aula7'
import { aula8 } from './aulas/aula8'
import { aula9 } from './aulas/aula9'
import { aula10 } from './aulas/aula10'

export const aulas: Aula[] = [aula1, aula2, aula3, aula4, aula5, aula6, aula7, aula8, aula9, aula10]

export const getAulaById = (id: string): Aula | undefined => aulas.find((a) => a.id === id)
