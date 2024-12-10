export class ContainerImage {
    constructor(imagePath: string);
    public extract(): Promise<void>;
    public verify(): Promise<boolean>;
}

export interface ImageOptions {
    cpus: number;
    mem: number;
}

export interface TestOutput {
    passed: boolean;
    weight: number;
}

export class ContainerEngine {
    constructor(imageOptions: ImageOptions, image: ContainerImage, submissionPath: string);
    public init(): Promise<void>;
    public waitForOutput(): Promise<string>;
    public getResults(): Promise<TestOutput[]>;
}
