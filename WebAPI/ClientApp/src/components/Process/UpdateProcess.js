import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";

export default class UpdateProcess extends Component {

    state = {
        bicycles: [],
        customers: [],
        employees: [],
        productCategories: [],
        products: [],
        selectedProductCategoryId: 0,
        selectedProduct: 0,
        quantity: 0,
        discount: 0,
        selectedProcessId: 0,
        selectedEmployeeId: 0,
        selectedCustomerId: 0,
        selectedBicycleId: 0,
        selectedEmployeeName: "",
        selectedCustomerName: "",
        selectedBicycle: "",
        startingDate: "",
        competitionDate: "",
        diagnostics: "",
        status: "",
        isProcessLoaded: false,
    };

    componentDidMount() {
        this.getProcessDetailsById(this.props.getProcess);
        this.getBicyclesByCustomer(this.props.getCustomer);
        this.getCustomers();
        this.getEmployees();
        this.getProductCategories();
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        this.setState({ [name]: value });
    };

    handleChangeBicycle = (event) => {
        this.setState({ selectedBicycleId: parseInt(event.target.value) });
    }

    handleChangeEmployee = (event) => {
        this.setState({ selectedEmployeeId: parseInt(event.target.value) });
    }

    handleChangeCustomer = (event) => {
        this.state.selectedCustomerId = document.getElementById("owner").value;
        this.getBicyclesByCustomer(this.state.selectedCustomerId);
    }

    handleChangeProductCategory = (event) => {
        this.state.selectedProductCategoryId = document.getElementById("productCategory").value;
        this.getProductsByCategory(this.state.selectedProductCategoryId);
    }

    handleChangeProduct = (event) => {
        this.setState({ selectedProduct: parseInt(event.target.value) });
    }

    //Müşterileri Db'den çekme
    getCustomers() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/customers/getall";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ customers: data }));
    };

    //Ürün Kategorilerini Db'den çekme
    getProductCategories() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/productcategories/getall";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ productCategories: data }));
    };

    //Ürünleri Kategorilere göre Db'den çekme
    getProductsByCategory(id) {
    let token = localStorage.getItem('token');
    if (token == null) {
        alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
        this.props.history.push("/girisYap")
    }

    let url = "/api/products/getallbycategoryid?id=" + id;
    fetch(url, {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then((response) => response.json())
        .then((data) => this.setState({ products: data }));
    };

    //Personelleri Db'den çekme
    getEmployees() {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/employees/getall";
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({ employees: data }));
    };

    //Servis Hizmeti Detay Bilgisini Db'den Çekme (ProcessDetailDto)
    getProcessDetailsById(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/processes/getprocessdetailsbyid?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState(
                {
                    selectedProcessId: data.processId,
                    selectedEmployeeId: data.employeeId,
                    selectedCustomerId: data.customerId,
                    selectedBicycleId: data.bicycleId,
                    selectedEmployeeName: data.employeeName,
                    selectedCustomerName: data.customerName,
                    selectedBicycle: data.bicycle,
                    startingDate: data.startingDate,
                    competitionDate: data.competitionDate,
                    diagnostics: data.diagnostics,
                    status: data.status,
                    isProcessLoaded: true,
                }));
    };

    //Müşteriye Göre Bisikletleri Db'den Çekme
    getBicyclesByCustomer(id) {

        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/bicycles/getdetailsbycustomer?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => this.setState({
                bicycles: data,
                selectedBicycleId: data[0].bicycleId,
                isProcessLoaded: true
            }));

    };

    addConsumedPart(){
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                processId: this.state.selectedProcessId,
                productId : this.state.selectedProduct,
                quantity : this.state.quantity,
                discount: this.state.discount,
            }),
        };

        fetch("/api/consumedparts/add", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                alertify.success(data.message);
            })

            .catch((responseError) => {
                if (responseError.Errors) {
                    if (responseError.Errors.length > 0) {
                        for (let i = 0; i < responseError.Errors.length; i++) {
                            alertify.error(responseError.Errors[i].ErrorMessage);
                        }
                    }
                    else {
                        alertify.error(responseError.Message);
                    }
                }
            });
    }

    //Bisiklet güncelleme
    updateProcess = (event) => {
        event.preventDefault();
        this.addConsumedPart();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                processId: this.state.selectedProcessId,
                employeeId: this.state.selectedEmployeeId,
                customerId: this.state.selectedCustomerId,
                bicycleId: this.state.selectedBicycleId,
                startingDate: this.state.startingDate,
                completionDate: this.state.competitionDate,
                diagnostics: this.state.diagnostics,
                status: this.state.status,
            }),
        };

        fetch("/api/processes/update", requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                alertify.success(data.message);
                this.props.history.push("/servisHizmeti");
            })

            .catch((responseError) => {
                if (responseError.Errors) {
                    if (responseError.Errors.length > 0) {
                        for (let i = 0; i < responseError.Errors.length; i++) {
                            alertify.error(responseError.Errors[i].ErrorMessage);
                        }
                    }
                    else {
                        alertify.error(responseError.Message);
                    }
                }
            });
    }

    //Bisiklet güncelleme Form
    updateProcessForm() {
        return (
            <Form onSubmit={this.updateProcess}>
                <h1> Servis Hizmeti Güncelle</h1>
                <Row>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="owner">Müşteri</Label>
                            <Input value={this.state.selectedCustomerId} type="select" name="owner" id="owner" onChange={this.handleChangeCustomer}>
                                {this.state.customers.map((customer) => (
                                    <option key={customer.customerId} value={customer.customerId} >{customer.firstName} {customer.lastName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col md={4}>
                        {this.state.isProcessLoaded == true ?
                            <FormGroup>
                                <Label for="bicycle">Bisiklet</Label>
                                <Input value={this.state.selectedBicycleId} type="select" name="bicycle" id="bicycle" onChange={this.handleChangeBicycle} >
                                    {this.state.bicycles.map((bicycle) => (
                                        <option key={bicycle.bicycleId} value={bicycle.bicycleId}>{bicycle.brandName} {bicycle.modelName}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                            :
                            null
                        }
                    </Col>

                    <Col md={4}>
                        <FormGroup>
                            <Label for="employee">Personel</Label>
                            <Input value={this.state.selectedEmployeeId} type="select" name="employee" id="employee" onChange={this.handleChangeEmployee}>
                                {this.state.employees.map((employee) => (
                                    <option key={employee.employeeId} value={employee.employeeId}>{employee.firstName} {employee.lastName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="status">Durum</Label>
                            <Input type="select" name="status" id="status" onChange={this.handleChange}>
                                <option selected value={this.state.status} >{this.state.status}</option>
                                <option value="Beklemede" >Beklemede</option>
                                <option value="Devam Ediyor" >Devam Ediyor</option>
                                <option value="Tamamlandı" >Tamamlandı</option>
                                <option value="Teslim Edildi" >Teslim Edildi</option>
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col md={8}>
                        <FormGroup>
                            <Label for="diagnostics">Teşhisler</Label>
                            <Input type="text" name="diagnostics" id="diagnostics" defaultValue={this.state.diagnostics} onChange={this.handleChange}></Input>
                        </FormGroup>
                    </Col>
                </Row>

                <hr></hr>

                <Row>
                    <Col md={3}>
                        <FormGroup>
                            <Label for="productCategory">Ürün Kategorisi</Label>
                            <Input value={this.state.selectedProductCategoryId} type="select" name="productCategory" id="productCategory" onChange={this.handleChangeProductCategory}>
                                <option selected value={0}>Seçiniz</option>
                                {this.state.productCategories.map((category) => (
                                    <option key={category.productCategoryId} value={category.productCategoryId}>{category.name}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col md={3}>
                        <FormGroup>
                            <Label for="product">Ürün</Label>
                            <Input value={this.state.selectedProduct} type="select" name="product" id="product" onChange={this.handleChangeProduct}>
                                <option selected value={0}>Seçiniz</option>
                                {this.state.products.map((product) => (
                                    <option key={product.productId} value={product.productId}>{product.brandName} - {product.productName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col md={3}>
                        <FormGroup>
                            <Label for="quantity">Adet</Label>
                            <Input type="number" name="quantity" id="quantity" min={0} onChange={this.handleChange}></Input>
                        </FormGroup>
                    </Col>

                    <Col md={3}>
                        <FormGroup>
                            <Label for="discount">İndirim Oranı</Label>
                            <Input type="number" name="discount" id="discount" min={0} onChange={this.handleChange}></Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Button>Ekle</Button>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.updateProcessForm()}
            </div>
        );
    }
};