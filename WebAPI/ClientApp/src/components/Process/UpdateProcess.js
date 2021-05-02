import React, { Component } from 'react';
import alertify from "alertifyjs";
import { Button, Form, FormGroup, Label, Input, Row, Col, Table } from "reactstrap";

export default class UpdateProcess extends Component {

    state = {
        bicycles: [],
        customers: [],
        employees: [],
        productCategories: [],
        products: [],
        consumedParts: [],
        processCharge: 0,
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
        this.getConsumedParts(this.props.getProcess);
        this.GetProcessCharge(this.props.getProcess);
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

    //Kullanılan Ürünleri Db'den çekme
    getConsumedParts(id) {
        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/consumedparts/getdetailsbyprocessid?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({ consumedParts: data });
                this.CalculateProcessCharge(data);
            } );
            
    };

    //Servis hizmetinde kullanılan ürünlerin toplam ücretini hesaplamak için gerekli verileri al ve toplam ücreti hesapla
    CalculateProcessCharge(data = []){
        var totalPrice = 0;

        for (let index = 0; index < data.length; index++) {
            totalPrice = totalPrice + data[index].totalPrice;
            console.log(totalPrice);
        }
        
        this.AddProcessCharge(data[0].processId, totalPrice);
    }

    //Servis hizmetinde kullanılan ürünlerin toplam ücretini dbye gönder
    AddProcessCharge(processId, charge){
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                processId: processId,
                charge : charge
            }),
        };
        fetch("/api/processcharges/add", requestOptions);
    }

    //Servis hizmetinde kullanılan ürünlerin toplam ücretini db'den çek ve göster
    GetProcessCharge(processId){

        let token = localStorage.getItem('token');
        if (token == null) {
            alert('Bu sayfayı görüntüleyebilmek için giriş yapmalısınız!');
            this.props.history.push("/girisYap")
        }

        let url = "/api/processcharges/getbyprocessid?id=" + processId;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.data.charge) 
                this.setState({ processCharge: data.data.charge })
                
        });
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
                selectedBicycleId: data[0] == null ? 0 : data[0].bicycleId,
                isProcessLoaded: true
            }));

    };

    //Bisiklet güncelleme
    updateProcess = (event) => {
        event.preventDefault();

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

                <Table borderless>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Müşteri</th>

                            <td>
                                <Input value={this.state.selectedCustomerId} type="select" name="owner" id="owner" onChange={this.handleChangeCustomer}>
                                    {this.state.customers.map((customer) => (
                                        <option key={customer.customerId} value={customer.customerId} >{customer.firstName} {customer.lastName}</option>
                                    ))}
                                </Input>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Bisiklet</th>

                            <td>
                                {this.state.isProcessLoaded == true ?
                                    <Input value={this.state.selectedBicycleId} type="select" name="bicycle" id="bicycle" onChange={this.handleChangeBicycle} >
                                        {this.state.selectedBicycleId != 0 ? this.state.bicycles.map((bicycle) => (
                                            <option key={bicycle.bicycleId} value={bicycle.bicycleId}>{bicycle.brandName} {bicycle.modelName}</option>
                                        ))
                                            :
                                            <option value="Seçiniz">Seçiniz</option>}
                                    </Input>
                                    :
                                    null
                                }
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Personel</th>

                            <td>
                                <Input value={this.state.selectedEmployeeId} type="select" name="employee" id="employee" onChange={this.handleChangeEmployee}>
                                    {this.state.employees.map((employee) => (
                                        <option key={employee.employeeId} value={employee.employeeId}>{employee.firstName} {employee.lastName}</option>
                                    ))}
                                </Input>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Durum</th>

                            <td>
                                <Input type="select" name="status" id="status" onChange={this.handleChange}>
                                    <option selected value={this.state.status} >{this.state.status}</option>
                                    <option value="Beklemede" >Beklemede</option>
                                    <option value="Devam Ediyor" >Devam Ediyor</option>
                                    <option value="Tamamlandı" >Tamamlandı</option>
                                    <option value="Teslim Edildi" >Teslim Edildi</option>
                                </Input>
                            </td>
                        </tr>

                        <tr>
                            <th>Teşhisler</th>

                            <td>
                                <Input type="textarea" name="diagnostics" id="diagnostics" defaultValue={this.state.diagnostics} onChange={this.handleChange}></Input>
                            </td>
                        </tr>

                    </tbody>
                </Table>


                <Button>Güncelle</Button>
            </Form>

        )
    }

    //Kullanılan ürün ekleme
    addConsumedPart = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                processId: this.state.selectedProcessId,
                productId: this.state.selectedProduct,
                quantity: this.state.quantity,
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

                Array.from(document.querySelectorAll("input")).forEach((input) => (input.value = ""));
                this.setState({
                    selectedProductCategoryId: 0,
                    selectedProduct: 0,
                    productId: 0,
                    quantity: 0,
                    discount: 0,
                });

                alertify.success(data.message);
                this.getConsumedParts(this.props.getProcess);
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

    //Kullanılan ürün ekleme formu
    addConsumedPartForm() {
        return (
            <Form onSubmit={this.addConsumedPart}>
                <h1> Kullanılan Ürün Ekle</h1>
                <Table borderless>
                    <thead>
                        <tr>
                            <th></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Ürün Kategorisi</th>
                            <td>
                                <Input value={this.state.selectedProductCategoryId} type="select" name="productCategory" id="productCategory" onChange={this.handleChangeProductCategory}>
                                    <option selected value={0}>Seçiniz</option>
                                    {this.state.productCategories.map((category) => (
                                        <option key={category.productCategoryId} value={category.productCategoryId}>{category.name}</option>
                                    ))}
                                </Input>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Ürün</th>
                            <td>
                                <Input value={this.state.selectedProduct} type="select" name="product" id="product" onChange={this.handleChangeProduct}>
                                    <option selected value={0}>Seçiniz</option>
                                    {this.state.products.map((product) => (
                                        <option key={product.productId} value={product.productId}>{product.brandName} - {product.productName}</option>
                                    ))}
                                </Input>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Adet</th>
                            <td>
                                <Input type="number" name="quantity" id="quantity" defaultValue={0} min={0} onChange={this.handleChange}></Input>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">İndirim Oranı</th>
                            <td>
                                <Input type="number" name="discount" id="discount" defaultValue={0} min={0} onChange={this.handleChange}></Input>
                            </td>
                        </tr>
                    </tbody>
                </Table>
                <Button>Ekle</Button>
            </Form>
        )
    }

    //Db'Den çekilmiş kullanılan ürünleri listeleme
    ListConsumedParts() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>Ürün Kodu</th>
                        <th>Ürün</th>
                        <th>Adet</th>
                        <th>Birim Fiyat</th>
                        <th>Toplam Fiyat</th>
                        <th>İndirim Oranı</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.consumedParts.map((consumedPart) => (
                        <tr key={consumedPart.consumedPartId}>
                            <td>{consumedPart.productCode}</td>
                            <td>{consumedPart.product}</td>
                            <td>{consumedPart.quantity}</td>
                            <td>{consumedPart.unitPrice}</td>
                            <td>{consumedPart.totalPrice}</td>
                            <td>{consumedPart.discount}</td>
                            <td><Button onClick={this.deleteConsumedPart.bind(this, consumedPart.consumedPartId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateConsumedPart.bind(this, consumedPart.consumedPartId)} color="info">Güncelle</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    //Kullanılan Ürün Silme
    deleteConsumedPart(id) {

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch("/api/consumedparts/delete?id=" + id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getConsumedParts(this.props.getProcess);
                alertify.warning(data.message);
            })

            .catch((responseError) => {
                if (responseError.Errors) {
                    if (responseError.Errors.length > 0) {
                        for (let i = 0; i < responseError.Errors.length; i++) {
                            alertify.error(responseError.Errors[i].ErrorMessage);
                        }
                    }
                }
            });
    };

    //Servis Hizmeti güncellemek için Servis Hizmeti id'si gönderen fonksiyon
    setConsumedPart = (id) => {
        this.props.setConsumedPart(id);
    }

    //Servis Hizmeti Güncelleme
    updateConsumedPart(id) {
        this.setConsumedPart(id);
        this.props.history.push("/kullanılanÜrünüGüncelle");
    };

    render() {
        return (
            <div>
                <Row>
                    <Col md="6">
                        {this.updateProcessForm()}
                    </Col>

                    <Col md="6">
                        {this.addConsumedPartForm()}
                    </Col>
                </Row>
                <hr className="mb-3 mt-3" ></hr>
                <center><h1 className="mb-3">Toplam ücret: {Number.parseFloat(this.state.processCharge).toFixed(2)}</h1></center>
                {this.ListConsumedParts()}

            </div>



        );
    }
};