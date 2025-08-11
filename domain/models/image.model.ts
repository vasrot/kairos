export interface IImage {
  id: string;
  originalName: string;
  resolution: string;
  path: string;
  md5: string;
  ext: string;
  createdAt: Date;
}

export class Image implements IImage {
  constructor(
    public id: string,
    public originalName: string,
    public resolution: string,
    public path: string,
    public md5: string,
    public ext: string,
    public createdAt: Date
  ) {}
}