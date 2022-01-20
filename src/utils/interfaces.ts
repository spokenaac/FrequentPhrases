/**
 * Excludes parent property to avoid recursive outputs (parent nodes are implied
 * via object structure).
 * 
 * @property {number} visits
 * @property {string} nodeWord
 * @property {number} childBranches
 * @property {FPNodeProps[]} childNodes
 */
export interface FPNodeProps {
    visits: number,
    nodeWord: string,
    childBranches: number
    childNodes: FPNodeProps[],
}

/**
 * Excludes parent property to avoid recursive outputs (parent nodes are implied
 * via object structure).
 * 
 * @property {number} visits
 * @property {string} nodeWord
 * @property {number} childBranches
 * @property {FPNodeProps[] | FPNodePropsWithParents[]} childNodes
 * @property {FPNodeProps[] | FPNodePropsWithParents[]} parentNodes
 */
 export interface FPNodePropsWithParents {
    visits: number,
    nodeWord: string,
    childBranches: number
    childNodes: FPNodeProps[] | FPNodePropsWithParents[],
    parentNodes: FPNodeProps[] | FPNodePropsWithParents[]
}

export enum Format {
    String = 'string',
    Object = 'object'
}
