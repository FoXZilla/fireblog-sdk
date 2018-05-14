# fireblog-sdk

Some tools for FireBlog. Includes:

1. FireBean
1. FormDictator: Check & Format the js object

---

## Firebean

```js
import * as FireBean from '@foxzilla/fireblog-sdk/firebean';
```

### APIs

#### Methods

- stringify
- parse
- exec

#### Options

- DefaultData
- Actions

## FormDictator

```js
import FormDictator from '@foxzilla/fireblog-sdk/form-dictator';
```
### APIs

- FormDictator#pick
- FormDictator#clone

- FormDictator#noUndefined
- FormDictator#noNull
- FormDictator#noEmptyStr
- FormDictator#noEmpty

- FormDictator#changeIfExist
- FormDictator#require

- FormDictator#check
- FormDictator#checkIfExist

- FormDictator#waitResult
- FormDictator#hasFail
- FormDictator#witchFail

- FormDictator.diff

### Example

Here is the express router. It will create a comment.

```ts
router.post(`/comment/create`,async function(req,res,next){
    res.json(await async function(){
        var checker =new FormDictator(req.body)
            .pick(['article_id','md_content','reply_to'])
        ;
        if(
            (await checker
            .checkIfExist('reply_to',Comment.isExist) // Comment.isExist is the async method that check that the comment is exist or not from Database
            .waitResult())
            .hasFail()
        )return {
            errcode:Errcode.CommentNotFound,
            errmsg :`The comment that be replied is not exist.`,
        };if(
            (await checker
            .checkIfExist('reply_to',Comment.canBeReply)
            .waitResult())
            .hasFail()
        )return {
            errcode:Errcode.AccessDeny,
            errmsg :`Comment can't be replied.`,
        };if(
            (await checker
            .require('article_id')
            .check('article_id',Article.isExist) // like Comment.isExist
            .waitResult())
            .hasFail()
        )return {
            errcode:Errcode.ArticleNotFound,
            errmsg :`Article is not exist.`
        };if(
            (await checker
            .check('article_id',Article.canBeReply)
            .waitResult())
            .hasFail()
        )return {
            errcode:Errcode.AccessDeny,
            errmsg :`This Article disabled comment.`,
        };

        await Comment.create(checker.data));

        return {
            errcode:Errcode.Ok,
            errmsg :'ok',
        };
    }());
});
```



