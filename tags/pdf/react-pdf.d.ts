declare module "react-pdf/dist/umd/entry.parcel" {
  export * from "react-pdf";
  export interface DocumentProps {
    onLoadSuccess(p: { numPages: number }): void;
  }
}
