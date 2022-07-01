export interface Friend{
  friendName: string;
  extraPaidGrp : PaidGrp[]
}

export interface PaidGrp{
  place:string;
  paidAmt:number;
  comment:string;
}

export interface FriendDisplayInfo{
  friendName:string;
  totalpaid : number;
  paidStr:string;
  numStr:string;
}
