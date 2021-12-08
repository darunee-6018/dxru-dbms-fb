import React, {Component} from "react";
import axios from "axios";
import Modal from 'react-awesome-modal';
import './Showdata.css';
//import '../../server/app';
import {ip,port} from "../setIP/setting";

export default class Showdata extends Component{
    constructor() {
        super();
        this.state ={
            list:[],
            idkey:"",
            fname:"",
            lname:"",
            tel:"",
            email:""
        }
        this.handleChang = this.handleChang.bind(this);
        this.handleClicked = this.handleClicked.bind(this);
        //console.log("hello show data");
    }
    componentDidMount() {
        //console.log("before get data");
        this.getData();
        //console.log("after get data");
    }
    getData = () => {
        console.log("before fetch data");
        fetch('/data')
            .then(res => res.json())
            .then(list => this.setState({ list }))
            // .then(res => {res.json(); })
            // .then(list => {this.setState({ list });})
        console.log("after fetch data");
    }

    onDelete=(user)=>{
        let url = `https://localhost:3000/delete`;
        let data = {
            idkey:user.id
        }
        axios.put(url,data)
        setTimeout(()=>{this.componentDidMount()},1)
    }

    openModal() {
        this.setState({
            visible : true
        });

    }
    closeModal() {
        this.setState({
            visible : false
        });
    }
    call=(user)=>{
        this.openModal();
        this.setState({
            idkey:user.id,
            fname:user.fname,
            lname:user.lname,
            tel:user.tel,
            email:user.email
        })
    }
    handleChang = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
        let url = `https://localhost:3000/data`;
        let data = {
            idkey:this.state.id,
            fname:this.state.fname,
            lname:this.state.lname,
            tel:this.state.tel,
            email:this.state.email
        }
        axios.put(url,data)
    }

    handleClicked(){
        let url = `https://localhost:3000/data`;
        let data = {
            idkey:this.state.id,
            fname:this.state.fname,
            lname:this.state.lname,
            tel:this.state.tel,
            email:this.state.email
        }
        axios.put(url,data)
        this.setState({
            id:"",
            fname:"",
            lname:"",
            tel:"",
            email:""
        });
	this.closeModal();
        setTimeout(()=>{this.componentDidMount()},1)
    }
    render() {
        let {list} = this.state;

        return (
            <div className="App">
                <h2 className="my-4">Users Information<br/></h2>
                <hr/>
                <div className="container p-3 my-3 bg-dark text-white">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Telephone</th>
                            <th>E-mail</th>
                            </tr>
                        </thead>
                        <tbody>
                                {list.map((user) =>{
                                    console.log(user);
                                    return(
                                        <tr>
                                            <td>{user.id}</td>
                                            <td>{user.fname}</td>
                                            <td>{user.lname}</td>
                                            <td>{user.tel}</td>
                                            <td>{user.email}</td>
                                            <td><button type="button" class="btn btn-warning" onClick={()=>this.call(user)}>Edit</button></td>
                                            <td><button type="button" class="btn btn-danger"  onClick={()=>this.onDelete(user)}>Delete</button></td>
                                            <div className="box">
                                                <Modal visible={this.state.visible}
                                                       width="1200"
                                                       height="600"
                                                       effect="fadeInUp"
                                                       onClickAway={() => this.closeModal()}
                                                >
                                                    <form className="container" id='form'>
                                                        <div className="form-group">
                                                            <h3><label htmlFor="id">ID: {this.state.idkey}<br/></label></h3>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>firstname:</label>
                                                            <input type="text" className="form-control" id="fname" onChange={this.handleChang} value={this.state.fname}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>lasttname:</label>
                                                            <input type="text" className="form-control" id="lname" onChange={this.handleChang} value={this.state.lname}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Telephone:</label>
                                                            <input type="text" className="form-control" id="tel" onChange={this.handleChang} value={this.state.tel}/>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>E-mail:</label>
                                                            <input type="text" className="form-control" id="email" onChange={this.handleChang} value={this.state.email}/>
                                                        </div>
                                                        <button type="button" className="btn btn-primary" onClick={this.handleClicked}>Submit</button>
                                                    </form>
                                                </Modal>
                                            </div>
                                        </tr>
                                    )})}
                        </tbody>
                    </table>
                </div><br/>
            </div>
        );
    }
}
