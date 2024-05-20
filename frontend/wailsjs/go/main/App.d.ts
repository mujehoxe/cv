// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {main} from '../models';

export function CreateCVProfile(arg1:string):Promise<string>;

export function CreateOrUpdateProfile(arg1:main.User,arg2:string,arg3:string,arg4:string):Promise<void>;

export function CreateProfile(arg1:number,arg2:string,arg3:string,arg4:string):Promise<void>;

export function CreateUser(arg1:main.User):Promise<number>;

export function DeleteUser(arg1:number):Promise<void>;

export function FetchCVAndSave(arg1:string,arg2:string):Promise<string>;

export function FetchDigitalSkillsAutocomplete(arg1:string):Promise<Array<string>>;

export function GetPdfFile(arg1:string):Promise<Array<number>>;

export function GetProfile(arg1:string):Promise<any>;

export function GetProfilesOfUser(arg1:number):Promise<Array<main.Profile>>;

export function GetUserByID(arg1:number):Promise<main.User>;

export function GetUsersPaginated(arg1:number,arg2:number):Promise<main.paginatedUsersResult>;

export function OpenPDF(arg1:string):Promise<void>;

export function SearchUsers(arg1:string,arg2:number,arg3:number):Promise<main.paginatedUsersResult>;

export function Translate(arg1:string,arg2:string,arg3:string):Promise<string>;

export function TranslateHTML(arg1:string,arg2:string,arg3:string):Promise<string>;

export function UpdateCVProfile(arg1:string,arg2:string):Promise<string>;

export function UpdateProfileID(arg1:main.User,arg2:string,arg3:string):Promise<void>;

export function UpdateUser(arg1:number,arg2:string,arg3:string,arg4:string):Promise<void>;
