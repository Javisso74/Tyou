import { IProtocolHelper, IRequestProtocol, IResponseProtocol, NetData } from "./NetInterface";

export class NetProtocolJson implements IProtocolHelper {
    getHeadlen(): number {
        return 0;
    }

    getHearbeat(): NetData {
        return "";
    }

    getPackageLen(msg: NetData): number {
        return msg.toString().length;
    }

    checkResponsePackage(respProtocol: IResponseProtocol): boolean {
        return true;
    }

    handlerResponsePackage(respProtocol: IResponseProtocol): boolean {
        if (respProtocol.data?.errcode == 0) {
            // if (respProtocol.isCompress) {
                // respProtocol.data
                // const p = Person.decode(msg);
            // }
            // respProtocol.data = JSON.parse(respProtocol.data);

            return true;
        }
        else {
            return false;
        }
    }

    handlerRequestPackage(reqProtocol: IRequestProtocol): string {
        var rspCmd = reqProtocol.c + "_" + reqProtocol.m;
        reqProtocol.callback = rspCmd;
        if (reqProtocol.isCompress) {
            // reqProtocol.data
            // const msg = Person.encode({ name: "dgflash", id: 1 }).finish();
        }
        return rspCmd;
    }

    getPackageId(respProtocol: IResponseProtocol): string {
        return respProtocol.c + "_" + respProtocol.m;
    }
}