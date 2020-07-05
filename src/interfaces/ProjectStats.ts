/**
 * Represents stats for a project on Scratch.
 */
export interface ProjectStats {
    /**
     * The number of comments on the project.
     * @type {number}
     */
    comments: number;
    
    /**
     * The number of favourites on the project.
     * @type {number}
     */
    favorites: number;
    
    /**
     * The number of loves on the project.
     * @type {number}
     */
    loves: number;
    
    /**
     * The number of remixes on the project.
     * @type {number}
     */
    remixes: number;
    
    /**
     * The number of views on the project.
     * @type {number}
     */
    views: number;
}