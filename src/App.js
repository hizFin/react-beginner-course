/* eslint-disable */
import logo from './logo.svg';
import { useState } from 'react';
import './App.css';

function Header(props){
  return (
    <header>
        <h1><a href="/" onClick={(event)=>{
          event.preventDefault(); // 클릭 시 a태그 기본기능인 reload 방지
          props.onChangeMode();
        }}>{props.title}</a></h1>
      </header>  
  );
}
function Nav(props){
  const lis =[]
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event=>{
        event.preventDefault();
        props.onChangeMode(Number(event.target.id));
      }}>{t.title}</a></li>
      )
  }
  return (
      <nav>
        <ol>
          {lis}
        </ol>
      </nav>
  );
}
function Article(props){
  return (
      <article>
        <h2>{props.title}</h2>
        {props.body}
      </article>
  );
}
function Create(props){
  return (
      <article>
        <h2>Create</h2>
        <form onSubmit={event=>{
          event.preventDefault();
          const title = event.target.title.value
          const body = event.target.body.value
          props.onCreate(title, body);
        }}>
          <p><input type="text" name ="title" placeholder='title'/></p>
          <p><textarea name="body" placeholder='body'/></p>
          <p><input type="submit" value="Create"></input></p>
        </form>
      </article>
  );
}
function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
      <article>
        <h2>Update</h2>
        <form onSubmit={event=>{
          event.preventDefault();
          const title = event.target.title.value
          const body = event.target.body.value
          props.onUpdate(title, body);
        }}>
          <p><input type="text" name ="title" placeholder='title' value={title} onChange={event=>{
            console.log(event.target.value);
            setTitle(event.target.value);
          }}/></p>
          <p><textarea name="body" placeholder='body' value={body}  onChange={event=>{
            console.log(event.target.value);
            setBody(event.target.value);
          }}/></p>
          <p><input type="submit" value="Update"></input></p>
        </form>
      </article>
  );
}


function App() {
  // State 사용이유 : App 컴포넌트 재렌더링 하기 위함
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ])
  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"/>
  }else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i <topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    contextControl = <li><a href={'/update' + id} onClick={event=>{
      event.preventDefault(); // 👉 새로고침 방지
      setMode('UPDATE');
    }}>Update</a></li>    
    content = <Article title={title} body={body}/>
  }else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {
        id:nextId,
        title:_title, 
        body:_body
      }
      let copyTopics = [...topics];
      copyTopics.push(newTopic);
      setTopics(copyTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId + 1); // id 중복 방지
    }}></Create>
  }else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i <topics.length; i++){
      console.log(topics[i].id, id);
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      console.log(title, body);
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for(let i=0; i <newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');

    }}></Update>
  }
  return (
    <div>
      <Header title="React" onChangeMode={()=>{
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id)=>{
        setMode('READ');
        setId(_id);
      }}></Nav>
      {content}
      <ul>
        <li>
          <a href="/create" onClick={event=>{
            event.preventDefault();
            setMode('CREATE');
          }}>Create</a></li>
          {contextControl}
      </ul>
    </div>
  );
}

export default App;
