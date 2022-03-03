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
            list_province: [],
            list_district: [],
            list_subdistrict: [],
            list_village: [],
                    
            idkey:"",
            fname:"",
            lname:"",
            tel:"",
            email:"",

            timestamp: "",
            province: "",
            district: "",
            subdistrict: "",
            village: "",
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
        fetch('https://localhost:3000/data')
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

    getProvinces() {
        axios.get('/provinces')
        .then(res => {
            this.setState(() => ({list_province: res.data}));
        });
    }

    getDistricts(value) {
        axios.get(`/districts?provinceId=${value}`)
        .then(res => {
            this.setState(() => ({list_district: res.data}));
        });
    }

    getSubDistricts(value) {
        axios.get(`/subdistricts?districtId=${value}`)
        .then(res => {
            this.setState(() => ({list_subdistrict: res.data}));
        });
    }

    getVillage(value) {
        axios.get(`/villages?subdistrictId=${value}`)
        .then(res => {
            this.setState(() => ({list_village: res.data}));
        });
    }

    openModal(user) {
        this.getProvinces();
        this.getDistricts(user.provinceId);
        this.getSubDistricts(user.districtId);
        this.getVillage(user.subdistrictId);

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
        this.openModal(user);
        this.setState({
            idkey:user.id,
            fname:user.fname,
            lname:user.lname,
            tel:user.tel,
            email:user.email,

            timestamp: user.timestamp,
            province: user.province,
            district: user.district,
            subdistrict: user.subdistrict,
            village: user.village,
        })
    }
    handleChang = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        });

        switch(e.target.id) {
            case 'province':
                this.getDistricts(e.target.value);
                this.state.list_subdistrict = [];
                this.state.list_village = [];
                document.getElementById('district').disabled = e.target.value === "0" ? true : false;
                document.getElementById('subdistrict').disabled = true;
                document.getElementById('village').disabled = true;
                break;
            case 'district':
                this.getSubDistricts(e.target.value);
                this.state.list_village = [];
                document.getElementById('subdistrict').disabled = e.target.value === "0" ? true : false;
                document.getElementById('village').disabled = true;
                break;
            case 'subdistrict':
                this.getVillage(e.target.value);
                document.getElementById('village').disabled = e.target.value === "0" ? true : false;
                break;
        }

        // let url = `https://localhost:3000/data`;
        // let data = {
        //     idkey:this.state.id,
        //     fname:this.state.fname,
        //     lname:this.state.lname,
        //     tel:this.state.tel,
        //     email:this.state.email
        // }
        // axios.put(url,data)
    }

    getDateTimeFormatted = (data) => {
        const date = new Date(data);
        const resultDate = date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        const resultTime = date.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
        });
        return `${resultDate} ${resultTime}`;
    }

    handleClicked(){
        let url = `https://localhost:3000/data`;
        let data = {
            idkey:this.state.idkey,
            fname:this.state.fname,
            lname:this.state.lname,
            tel:this.state.tel,
            email:this.state.email,

            province: this.state.province,
            district: this.state.district,
            subdistrict: this.state.subdistrict,
            village: this.state.village,
        }
        axios.put(url,data)
        this.setState({
            idkey:"",
            fname:"",
            lname:"",
            tel:"",
            email:"",

            province: "",
            district: "",
            subdistrict: "",
            village: "",
        });
	this.closeModal();
        setTimeout(()=>{this.componentDidMount()},1)
    }
    render() {
        let {list} = this.state;

        return (
            <div className="App">
                <h2 className="my-4">Users Information Total : {this.state.list.length} List<br/></h2>
                <hr/>
                <div className="container p-3 my-3 bg-dark text-white">
                    <table className="table table-light">
                        <thead>
                            <tr>
                            <th>ID :</th>
                            <th>Name :</th>
                            <th>Details :</th>
                            <th>Credit By :</th>
                            
                            <th>Manage :</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                        {list.map((user) =>{
                                    return(
                                        <tr>
                                            <td>{user.id}</td>
                                            <td>{user.fname} {user.lname}</td>
                                            <td>
                                                <ul className="text-left">
                                                    <li>E-mail : {user.email}</li>
                                                    <li>Tel :{user.tel}</li>
                                                    <li>Village :{user.villageName}</li>
                                                    <li>Subdistrict :{user.subdistrictName}</li>
                                                    <li>District :{user.districtName}</li>
                                                    <li>Province :{user.provinceName}</li>
                                                </ul>
                                            </td>
                                            <td>{user.email} <br />
                                                {this.getDateTimeFormatted(user.timestamp)}</td>
                                            <td>
                                                <button type="button" class="btn btn-warning m-2" onClick={()=>this.call(user)}>Edit</button>
                                                <button type="button" class="btn btn-danger m-2"  onClick={()=>this.onDelete(user)}>Delete</button>
                                            </td>
                                            <div className="box">
                                                <Modal visible={this.state.visible}
                                                    width="1200"
                                                    height="600"
                                                    effect="fadeInUp"
                                                    onClickAway={() => this.closeModal()}
                                                >
                                                    <form className="container" id='form'>
                                                        <div className="form-group">
                                                            <h3><label htmlFor="id">ID: {this.state.id}<br/></label></h3>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>First Name:</label>
                                                                    <input type="text" className="form-control" id="fname" onChange={this.handleChang} value={this.state.fname}/>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>Last Name:</label>
                                                                    <input type="text" className="form-control" id="lname" onChange={this.handleChang} value={this.state.lname}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            {/* <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>E-mail :</label>
                                                                    <input type="text" className="form-control" id="email" onChange={this.handleChang} value={this.state.email}/>
                                                                </div>
                                                            </div> */}
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>Tel :</label>
                                                                    <input type="text" className="form-control" id="tel" onChange={this.handleChang} value={this.state.tel}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>Village</label>
                                                                    <select className="form-control" id="village" onChange={this.handleChang} >
                                                                        <option value={0}></option>
                                                                        {
                                                                            this.state.list_village.map((item) => {
                                                                                return(
                                                                                    <option value={item.villageId} selected={item.villageId == this.state.village}>{item.villageName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>Subdistrict</label>
                                                                    <select className="form-control" id="subdistrict" onChange={this.handleChang} >
                                                                        <option value={0}></option>
                                                                        {
                                                                            this.state.list_subdistrict.map((item) => {
                                                                                return(
                                                                                    <option value={item.subdistrictId} selected={item.subdistrictId == this.state.subdistrict}>{item.subdistrictName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>District</label>
                                                                    <select className="form-control" id="district" onChange={this.handleChang} >
                                                                        <option value={0}></option>
                                                                        {
                                                                            this.state.list_district.map((item) => {
                                                                                return(
                                                                                    <option value={item.districtId} selected={item.districtId == this.state.district}>{item.districtName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                            <div className="col-md">
                                                                <div className="form-group">
                                                                    <label>Province</label>
                                                                    <select className="form-control" id="province" onChange={this.handleChang}>
                                                                        <option value={0}></option>
                                                                        {
                                                                            this.state.list_province.map((item) => {
                                                                                return(
                                                                                    <option value={item.provinceId} selected={item.provinceId == this.state.province}>{item.provinceName}</option>
                                                                                );
                                                                            })
                                                                        }
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="id">Credit By: {this.state.email}<br/></label>
                                                        </div>
                                                        <div className="form-group">
                                                            <label htmlFor="id">Edit last: {this.getDateTimeFormatted(this.state.timestamp)}<br/></label>
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
