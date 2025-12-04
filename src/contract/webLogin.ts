import { ICallContractParams } from "@aelf-web-login/wallet-adapter-base";

import { SupportedELFChainId } from "@/constants/app";

export interface IWebLoginContext {
  callSendMethod<T, R>(params: ICallContractParams<T>): Promise<R>;
  callViewMethod<T, R>(params: ICallContractParams<T>): Promise<R>;
}
export interface IWebLoginArgs {
  address: string;
  chainId: string;
}

export default class WebLoginInstance {
  public contract: unknown;
  public address: string | undefined;
  public chainId: string | undefined;

  private static instance: WebLoginInstance | null = null;
  private context: IWebLoginContext | null = null;

  constructor(options?: IWebLoginArgs) {
    this.address = options?.address;
    this.chainId = options?.chainId;
  }
  static get() {
    if (!WebLoginInstance.instance) {
      WebLoginInstance.instance = new WebLoginInstance();
    }
    return WebLoginInstance.instance;
  }

  setWebLoginContext(context: IWebLoginContext) {
    this.context = context;
  }

  getWebLoginContext() {
    return this.context; // wallet, login, loginState
  }

  callSendMethod<T, R>(
    chain: Chain,
    params: ICallContractParams<T>
  ): Promise<R> {
    if (!this.context) {
      throw new Error("Error: WebLoginContext is not set");
    }
    switch (chain) {
      case SupportedELFChainId.MAIN_NET:
        return this.context.callSendMethod(params);
      case SupportedELFChainId.TDVV_NET:
        return this.context.callSendMethod(params);
      case SupportedELFChainId.TDVW_NET:
        return this.context.callSendMethod(params);
    }
    throw new Error("Error: Invalid chainId");
  }

  callViewMethod<T, R>(
    chain: Chain,
    params: ICallContractParams<T>
  ): Promise<R> {
    if (!this.context) {
      throw new Error("Error: WebLoginContext is not set");
    }
    switch (chain) {
      case SupportedELFChainId.MAIN_NET:
        return this.context.callViewMethod(params);
      case SupportedELFChainId.TDVV_NET:
        return this.context.callViewMethod(params);
      case SupportedELFChainId.TDVW_NET:
        return this.context.callViewMethod(params);
    }
    throw new Error("Error: Invalid chainId");
  }
}

export const webLoginInstance = WebLoginInstance.get();
