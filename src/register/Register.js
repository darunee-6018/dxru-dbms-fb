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
            email:"",
            
            province: "",
            district: "",
            subdistrict: "",
            village: "",

            list_province: [],
            list_district: [],
            list_subdistrict: [],
            list_village: [],

        }
        this.handleChang = this.handleChang.bind(this);
        this.handleClicked = this.handleClicked.bind(this);
    }

    componentDidMount() {
        document.getElementById('district').disabled = true;
        document.getElementById('subdistrict').disabled = true;
        document.getElementById('village').disabled = true;

        this.getProvinces();
    }
    
    _baseURL = '';

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
    }
    handleClicked(){
        const resLocalStorage = JSON.parse(localStorage.getItem('user'));
        let url = `https://localhost:3000/data`;
        let data = {
            idkey:this.state.idkey,
            fname:this.state.fname,
            lname:this.state.lname,
            tel:this.state.tel,
            email: resLocalStorage.email,

            province: this.state.province,
            district: this.state.district,
            subdistrict: this.state.subdistrict,
            village: this.state.village,
        }
        axios.post(url,data)
        this.setState({
            idkey:"",
            fname:"",
            lname:"",
            tel:"",
            email:"",

            province: "",
            district: "",
            subdistrict: "",
            village: ""
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
                    {/* <div className="form-group">
                        <label className="text-white"  >E-mail</label>
                        <input type="text" className="form-control" id="email" onChange={this.handleChang} value={this.state.email}/>
                    </div> */}
                    <div className="form-group">
                        <label className="text-white"  htmlFor="id">Id</label>
                        <input type="text" className="form-control" size="10" id="idkey" onChange={this.handleChang} value={this.state.idkey}/>
                    </div>
                    <div className="row">
                        <div className="col-md">
                            <div className="form-group">
                                <label className="text-white">Village</label>
                                <select className="form-control" id="village" onChange={this.handleChang} >
                                    <option value={0}></option>
                                    {
                                        this.state.list_village.map((item) => {
                                            return(
                                                <option value={item.villageId}>{item.villageName}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <label className="text-white">Subdistrict</label>
                                <select className="form-control" id="subdistrict" onChange={this.handleChang} >
                                    <option value={0}></option>
                                    {
                                        this.state.list_subdistrict.map((item) => {
                                            return(
                                                <option value={item.subdistrictId}>{item.subdistrictName}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">       
                        <div className="col-md">
                            <div className="form-group">
                                <label className="text-white">District</label>
                                <select className="form-control" id="district" onChange={this.handleChang} >
                                    <option value={0}></option>
                                    {
                                        this.state.list_district.map((item) => {
                                            return(
                                                <option value={item.districtId}>{item.districtName}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md">
                            <div className="form-group">
                                <label className="text-white">Province</label>
                                <select className="form-control" id="province" onChange={this.handleChang}>
                                    <option value={0}></option>
                                    {
                                        this.state.list_province.map((item) => {
                                            return(
                                                <option value={item.provinceId}>{item.provinceName}</option>
                                            );
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={this.handleClicked}>Submit</button>
                </form>
            </div>
        );
    }
}
