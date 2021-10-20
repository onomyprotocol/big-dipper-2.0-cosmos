import { Categories } from '../types';

class MsgBurnNFT {
  public category: Categories;
  public type: string;
  public json: any;
  public sender: string;
  public id: string;

  constructor(payload: any) {
    this.category = 'nft';
    this.type = payload.type;
    this.json = payload.json;
    this.sender = payload.sender;
    this.id = payload.id;
  }

  static fromJson(json: any) {
    return new MsgBurnNFT({
      json,
      type: json['@type'],
      sender: json?.sender,
      name: json?.id,
    });
  }
}

export default MsgBurnNFT;
