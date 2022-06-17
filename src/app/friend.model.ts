export interface friend{
  friendName: string;
  extraPaidGrp : paidGrp[]
}

export interface paidGrp{
  place:string;
  paidAmt:number;
  comment:string;
}

export interface friendDisplayInfo{
  friendName:string;
  totalpaid : number;
  paidStr:string;
  numStr:string;
}
