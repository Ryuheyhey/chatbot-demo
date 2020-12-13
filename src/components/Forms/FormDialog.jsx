import React, {useState, useEffect, useCallback} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextInput from './TextInput.jsx'

const FormDialog = (props) => {
 
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [description, setDescription] = useState("")

    // inputされた名前を更新する変数
  const inputName = useCallback((event) => {
    setName(event.target.value)
  }, [setName])

  const inputEmail = useCallback((event) => {
    setEmail(event.target.value)
  }, [setEmail])

  const inputDescription = useCallback((event) => {
    setDescription(event.target.value)
  }, [setDescription])

  // slackに連携して、お問い合わせフォームの内容を送る
  const submitForm =() => {
    
    // 送る内容
    const payload = {
      text: 'お問い合わせがありました\n' +
      'お名前:' + name + '\n' +
      'メールアドレス:' + email + '\n' +
            'お問い合わせ内容/n' + description
          }
          // 送るメソッド
          const url = 'https://hooks.slack.com/services/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'
          
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload)
    }).then(()=>{
      alert('送信が完了しました。追ってご連絡します')
      setName("")
      setEmail("")
      setDescription("")
      return props.handleClose()
    })
  }
  
  
    return(
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
        <DialogTitle id="alert-dialog-title">お問い合わせフォーム</DialogTitle>
        <DialogContent>
         <TextInput 
          label={"お名前(必須)"} multiline={false}  rows={1}
          value={name} type={"text"} onChange={inputName}
          />

         <TextInput 
          label={"メールアドレス(必須)"} multiline={false}  rows={1}
          value={email} type={"email"} onChange={inputEmail}
         />

         <TextInput 
          label={"お問い合わせ内容(必須)"} multiline={true}  rows={5}
          value={description} type={"text"} onChange={inputDescription}
          />
         
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={props.handleClose} color="primary">
            キャンセル
          </Button>
          <Button variant="outlined" onClick={submitForm} color="primary" autoFocus>
            送信する
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

export default FormDialog