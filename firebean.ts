import {FireBean as FireBeanTypes ,Omit} from '@foxzilla/fireblog';

declare var localStorage:any;
declare var window:any;
declare var location:any;
declare var setTimeout:any;

export const DefaultData ={
    _firebean:'1',
    _version :'0.0.1-alpha.26',
    _close   :FireBeanTypes.CloseType.justClose,
    _redirect:'/',
};

export const Actions:{
    set_storage: (data:FireBeanTypes.SetStorageData)=>void,
    remove_storage: (data:FireBeanTypes.RemoveStorageData)=>void,
    go_article: (data:FireBeanTypes.GoArticleData)=>void,
    go_comment: (data:FireBeanTypes.GoCommentData)=>void,
    go_user: (data:FireBeanTypes.GoUserData)=>void,
} ={
    set_storage(data){
        localStorage.setItem(data.key,data.value);
    },
    remove_storage(data){
        localStorage.removeItem(data.key);
    },
    go_article(data){},
    go_comment(data){},
    go_user(data){},
};

export function stringify(inputData:Omit<FireBeanTypes.SetStorageData,'_version'|'_firebean'> ,baseUrl?:string):string;
export function stringify(inputData:Omit<FireBeanTypes.RemoveStorageData,'_version'|'_firebean'> ,baseUrl?:string):string;
export function stringify(inputData:Omit<FireBeanTypes.GoArticleData,'_version'|'_firebean'> ,baseUrl?:string):string;
export function stringify(inputData:Omit<FireBeanTypes.GoCommentData,'_version'|'_firebean'> ,baseUrl?:string):string;
export function stringify(inputData:Omit<FireBeanTypes.GoUserData,'_version'|'_firebean'> ,baseUrl?:string):string;
export function stringify(inputData:any ,baseUrl =''):string{
    return `${baseUrl}/_firebean?${
        Object.entries(Object.assign({},DefaultData,inputData))
            .map(
                ([key,value]) =>`${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`
            )
            .join('&')
    }`;
}

export function exec(input:FireBeanTypes.Data|string =location.href){
    var data:FireBeanTypes.Data =typeof input ==='string' ?parse(input) :input;
    Actions[data._type](data);
    if(data._close ===FireBeanTypes.CloseType.justClose){
        window.close();
    }else if(data._close ===FireBeanTypes.CloseType.onlyBlank){
        if(window.opener) window.close();
    };
    setTimeout(
        ()=>window.open(data._redirect,'_self'),
        0,
    );
}

export function parse(url:string):FireBeanTypes.Data{
    var queryString:string =url.split('?').pop()!.split('#').shift()!;
    var data:any ={};
    for(let item of queryString.split('&')){
        let [key,value] =item.split('=');
        data[decodeURIComponent(key)] =decodeURIComponent(value);
    };
    return Object.assign({},DefaultData,data) as FireBeanTypes.Data;
}
