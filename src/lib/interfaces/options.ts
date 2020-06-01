import { CipherGCMTypes, CipherCCMTypes } from 'crypto';

export interface Options {
  /**
   * Path when the session managment stores the data.
   */
  path: string;
  
  /**
   * Time of session duration (in minutes).
   */
  expires: number;

  /**
   * Name that the cookie will has when its created.
   */
  cookieName?: string;

  /**
   * `optional` Type of AES encryption to be used. If its not set, the data and the cookie will not be encrypted.
   * The available values are:
   * - `aes-128-ccm`
   * - `aes-192-ccm`
   * - `aes-256-ccm`
   * - `aes-128-gcm`
   * - `aes-192-gcm`
   * - `aes-256-gcm`
   */
  aesType?: CipherGCMTypes | CipherCCMTypes;

  /**
   * `default = 96` Lenght of the filename generated. 
   */
  filenameLength?: number;

  /**
   * `default = false` 
   */
  callback?: (data: any) => void
}