import React, {Component} from "react";
import axios from "axios";
import {ip,port} from "../setIP/setting";

export default class Register extends Component{
    constructor(props) {
        super();
        this.state = {
            idkey:"",
            fname:"",
            lname:"",
            tel:"",
            email:""
        }
        this.handleChang = this.handleChang.bind(this);
        this.handleClicked = this.handleClicked.bind(this);
    }
    handleChang = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });
    }
    handleClicked(){
        let url = `https://localhost:3000/data`;
        let data = {
            idkey:this.state.idkey,
            fname:this.state.fname,
            lname:this.state.lname,
            tel:this.state.tel,
            email:this.state.email
        }
        axios.post(url,data)
        this.setState({
            idkey:"",
            fname:"",
            lname:"",
            tel:"",
            email:""
        });
        this.props.history.push('/Showdata');
    }

    render() {
        return(
            <div>
                <div className="App">
                <h2 className="my-4">Register<br/></h2>
                    <hr/>
                </div>
                <form className="container">
                    <div className="form-group">
                        <label className="text-white" >First Name</label>
                        <input type="text" className="form-control" id="fname" onChange={this.handleChang} value={this.state.fname}/>
                    </div>
                    <div className="form-group">
                        <label className="text-white"  >Last Name</label>
                        <input type="text" className="form-control" id="lname" onChange={this.handleChang} value={this.state.lname}/>
                    </div>
                    <div className="form-group">
                        <label className="text-white" >Telephone</label>
                        <input type="text" className="form-control" id="tel" onChange={this.handleChang} value={this.state.tel}/>
                    </div>
                    <div className="form-group">
                        <label className="text-white"  >E-mail</label>
                        <input type="text" className="form-control" id="email" onChange={this.handleChang} value={this.state.email}/>
                    </div>
                    <div className="form-group">
                        <label className="text-white"  htmlFor="id">Id</label>
                        <input type="text" className="form-control" size="10" id="idkey" onChange={this.handleChang} value={this.state.idkey}/>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.handleClicked}>Submit</button>
                </form>
            </div>
        );
    }
}
