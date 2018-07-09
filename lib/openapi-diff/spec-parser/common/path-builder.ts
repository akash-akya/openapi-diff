
export class PathBuilder {
    public static createRootPathBuilder(): PathBuilder {
        return new PathBuilder([]);
    }

    private constructor(private readonly originalPath: string[]) {}

    public withChild(segment: string): PathBuilder {
        return new PathBuilder([...this.originalPath, segment]);
    }

    public build(): string[] {
        return [...this.originalPath];
    }
}
