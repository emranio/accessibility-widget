export interface ISettingsStates {
    fontSize?: number,
    contrast?: string,
    [key: string]: unknown;
}

export interface ISettings {
    states?: ISettingsStates;
    updatedAt?: Date;
}