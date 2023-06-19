import VersionInfo from 'src/config/version.json';

export class Version {
    readonly major: number;
    readonly minor: number;
    readonly revision: number;

    constructor(major: number, minor: number, revision: number) {
        this.major = major;
        this.minor = minor;
        this.revision = revision;
    }

    public toString(): string {
        return `v${this.major}.${this.minor}.${this.revision}`;
    }
}

const INSTANCE = new Version(VersionInfo.major, VersionInfo.minor, VersionInfo.revision);
export const useVersion = (): Version => INSTANCE;
