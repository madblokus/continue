/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { PearAuth } from "../index.js";

export class MarianAICredentials {
  private accessToken: string | undefined;
  private refreshToken: string | undefined;
  private getCredentials: (() => Promise<PearAuth | undefined>) | undefined;
  private setCredentials: (auth: PearAuth) => Promise<void>;

  constructor(
    getCredentials: (() => Promise<PearAuth | undefined>) | undefined,
    setCredentials: (auth: PearAuth) => Promise<void>,
  ) {
    this.getCredentials = getCredentials;
    this.setCredentials = setCredentials;
  }

  public setAccessToken(value: string | undefined): void {
    console.log("Setting MarianAI access token:", value);
    this.accessToken = value;
    console.log("MarianAI access token set to:", this.accessToken);
  }

  public setRefreshToken(value: string | undefined): void {
    console.log("Setting MarianAI refresh token:", value);
    this.refreshToken = value;
    console.log("MarianAI refresh token set to:", this.refreshToken);
  }

  public getAccessToken(): string | undefined {
    console.log("Getting MarianAI access token");
    const token = this.accessToken;
    console.log("Returning MarianAI access token:", token);
    return token;
  }

  public async checkAndUpdateCredentials(): Promise<boolean> {
    try {
      let creds: PearAuth | undefined;

      if (this.getCredentials && this.accessToken === undefined) {
        console.log("Attempting to get MarianAI credentials...");
        creds = await this.getCredentials();

        if (creds && creds.accessToken && creds.refreshToken) {
          this.accessToken = creds.accessToken;
          this.refreshToken = creds.refreshToken;
        } else {
          return false;
        }
      }

      // For now, we'll just validate that we have an access token
      // TODO: Implement token refresh logic specific to MarianAI
      if (!this.accessToken) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking MarianAI token:", error);
      return false;
    }
  }
}
