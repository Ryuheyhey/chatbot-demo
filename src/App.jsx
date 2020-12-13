import React, {useState, useEffect, useCallback} from 'react';
import './App.css';
import './assets/styles/styles.css';
import {AnswersList,Chats} from "./components/index";
import FormDialog from './components/Forms/FormDialog';
import {db} from './firebase/index.js';
import { display } from '@material-ui/system';

const App = () => {
   const [answers, setAnswers] = useState([])
   const [chats, setChats] = useState([])
   const [currentId, setCurrentId] = useState("init")
   const [dataset, setDataset] = useState({})
   const [open, setOpen] = useState(false)

   
   const displayNextQuestion = (nextQuestionId,nextDataset) => {
     addChats({
      text: nextDataset.question,
      type: 'question'
    })
    
      setAnswers(nextDataset.answers)
      setCurrentId(nextQuestionId)
      
  }

  const selectAnswer = (selectedAnswer,nextQuestionId) => {
    switch(true){
      case (nextQuestionId === 'init'):
        setTimeout(()=>displayNextQuestion(nextQuestionId, dataset[nextQuestionId]),500) 
        break;
        
        case (nextQuestionId === 'contact'):
          handleClickOpen()
          break;
          
          case (/^https:*/.test(nextQuestionId)):
            const a = document.createElement('a');
            a.href = nextQuestionId;
        a.target = '_blank'
        a.click();
        default:       
        addChats({
          text: selectedAnswer,
          type: 'answer'
          // chatの中身(実引数）
        })

        setTimeout(()=>displayNextQuestion(nextQuestionId, dataset[nextQuestionId]),500) 
        break;
      }
    }
    
    // chatの中身を入れ替える処理
    const addChats = (chat) => {
  setChats(prevChats => {
    return [...prevChats, chat]
  })
}

const handleClickOpen = () => {
  setOpen(true)
}

const handleClose = useCallback(() => {
  setOpen(false)
}, [setOpen])

// componentDidMount時の処理
useEffect(() => {
  (async() => {
    const initDataset = {};
    
    // db=firestoreからデータをもらう
    await db.collection('question').get().then(snapsshots => {
      snapsshots.forEach(doc => {
        const id = doc.id
        const data = doc.data()
        initDataset[id] = data
      })
    })
    // データの初期値を指定
    setDataset(initDataset)
    displayNextQuestion(currentId, initDataset[currentId])
  })()
}, [])

// componentDidUpdate時の処理
useEffect(() =>{
  // 新にchatはレンダーされたときに、画面が下にスクロールされる処理
  const scrollArea = document.getElementById('scroll-area')
  if (scrollArea) {
    scrollArea.scrollTop = scrollArea.scrollHeight
  }
  })

  
    return (
      <section className="c-section">
      <div className="c-box">
        <Chats chats={chats}/>
        <AnswersList 
          answers={answers}
          select={selectAnswer}
          />
        <FormDialog 
        open={open}
        handleClose={handleClose}/>  
      </div>
     </section>


);
}



export default App

