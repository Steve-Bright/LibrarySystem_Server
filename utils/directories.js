import os from "os"

export const homeDirectory = os.homedir()
export const kayinGyiDirectory = os.homedir() + "/KayinGyi/";
export const kayinGyiBooks = kayinGyiDirectory + "books/";
export const kayinGyiMembers = kayinGyiDirectory + "members/"
export const kayinGyiTemp = kayinGyiDirectory + "temp/"
export const kayinGyiBooksBarcode = kayinGyiDirectory + "booksBarcodes/"
export const kayinGyiMembersBarcode = kayinGyiDirectory + "membersBarcodes/"