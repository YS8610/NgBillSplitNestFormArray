export interface friend{
  name: string;
  paidGrp : extraPaidGrp[]
}

export interface extraPaidGrp{
  place:string;
  paidAmt:number;
  comment:string;
}
