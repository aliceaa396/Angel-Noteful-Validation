import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import config from '../config'
import Context from '../context'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNotes/addNote'
import Error from '../Error'
import './App.css';

class App extends Component {
  state = {
    notes: [],
    folders: []
  };

  handleDelete = ( id ) => {
    this.setState({notes: this.state.notes.filter( n => n.id !== id )});
  };

  handleAddFolder = (folder) => {
    this.setState({ folders:[...this.state.folders, folder] });
  }

  handleAddNote =(note) =>{
    this.setState({notes:[...this.state.notes, note]});
  }
   
  componentDidMount() {
    Promise.all( [
      fetch( `${ config.API_ENDPOINT }/notes` ),
      fetch( `${ config.API_ENDPOINT }/folders` )
    ] ).then( ( [ notesRes, foldersRes ] ) => {
      if ( !notesRes.ok ) 
        return notesRes.json().then( event => Promise.reject( event ) );
      if ( !foldersRes.ok ) 
        return foldersRes.json().then( event => Promise.reject( event ) );

      return Promise.all( [ notesRes.json(), foldersRes.json() ] );
    } ).then( ( [ notes, folders ] ) => {
      this.setState( { notes, folders } )
    } ).catch( error => {
      console.log( { error } )
    } );
  }

  renderNavRoutes() {
    return (<Error>{
      ['/', '/folder/:folderId'].map(path => (
        <Route exact={true} key={path} path={path} component={NoteListNav}/>))
      } <Route path="/note/:noteId" component={NotePageNav} /> 
      <Route path="/add-folder" component={NotePageNav}/>
      <Route path="/add-note" component={NotePageNav}/>
    </Error>);
  }

  renderMainRoutes() {
    return (<Error>{ 
      ['/', '/folder/:folderId'].map(path => (
        <Route exact={true} key={path} path={path} component={NoteListMain}/>))
      }
      <Route path="/note/:noteId" component = {NotePageMain}/>
      <Route path="/add-folder" component={AddFolder} />
      <Route path="/add-note" component={AddNote}/>
    </Error>);
  }

  render(){
    const value = {
      notes: this.state.notes,
      deleteNote: this.handleDelete,
      folders: this.state.folders,
      addFolder: this.handleAddFolder,
      addNote: this.handleAddNote
    };
    return ( <Context.Provider value={value}>
      <div className="App">
        <nav className="App__nav">{this.renderNavRoutes()}</nav>
        <header className="App__header">
          <h1>
            <Link to="/">Noteful</Link>{' '}
            <FontAwesomeIcon icon="check-double"/>
          </h1>
        </header>
        <main className="App__main">{this.renderMainRoutes()}</main>
      </div>
      </Context.Provider> 
    );
  }

}

export default App;
