export interface Session {
  created: Date;
  expires: Date;
  getData: () => any;
  setData: (data: any) => void;
}