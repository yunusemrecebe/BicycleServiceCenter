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
        consumedProducts: [],
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
        this.getConsumedProducts(this.props.getProcess);
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

    CreateTokenByRefreshToken() {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                token: localStorage.getItem('refreshToken'),
            }),
        };

        fetch("/api/auth/CreateTokenByRefreshToken", requestOptions)
            .then(async (response) => {
                const data = await response.json();
                console.log(data);
                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                localStorage.setItem('token', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);

                this.componentDidMount();
            })

            .catch((responseError) => {

                if (responseError.message == "Refresh Token Bulunamad??!") {
                    alert('Bu i??lemi ger??ekle??tirebilmek i??in giri?? yapmal??s??n??z!');
                    this.props.history.push("/girisYap")
                }
            });
    }

    //M????terileri Db'den ??ekme
    getCustomers() {
        let token = localStorage.getItem('token');

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

    //??r??n Kategorilerini Db'den ??ekme
    getProductCategories() {
        let token = localStorage.getItem('token');

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

    //??r??nleri Kategorilere g??re Db'den ??ekme
    getProductsByCategory(id) {
        let token = localStorage.getItem('token');

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

    //Personelleri Db'den ??ekme
    getEmployees() {
        let token = localStorage.getItem('token');

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

    //Kullan??lan ??r??nleri Db'den ??ekme
    getConsumedProducts(id) {
        let token = localStorage.getItem('token');

        let url = "/api/consumedproducts/getdetailsbyprocessid?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({ consumedProducts: data });
            });

    };

    //Servis hizmetinde kullan??lan ??r??nlerin toplam ??cretini db'den ??ek ve g??ster
    GetProcessCharge(processId) {

        let token = localStorage.getItem('token');

        let url = "/api/processcharges/calculate?processid=" + processId;
        fetch(url, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                this.setState({ processCharge: data.data.charge })

            });
    };

    //Servis Hizmeti Detay Bilgisini Db'den ??ekme (ProcessDetailDto)
    getProcessDetailsById(id) {
        let token = localStorage.getItem('token');

        let url = "/api/processes/getprocessdetailsbyid?id=" + id;
        fetch(url, {
            method: 'get',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.setState({
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
                });

            })
            .catch((responseError) => {
                if (responseError.Message == "Token Bulunamad??!") {
                    this.CreateTokenByRefreshToken();
                }
            })
    };

    //M????teriye G??re Bisikletleri Db'den ??ekme
    getBicyclesByCustomer(id) {

        let token = localStorage.getItem('token');

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

    //Bisiklet g??ncelleme
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
                this.props.history.push("/servis/listele");
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

    //Bisiklet g??ncelleme Form
    updateProcessForm() {
        return (

            <Form onSubmit={this.updateProcess}>
                <h1> Servis Hizmeti G??ncelle</h1>

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
                            <th scope="row">M????teri</th>

                            <td>
                                {this.state.isProcessLoaded == true ?
                                    <Input value={this.state.selectedCustomerId} type="select" name="owner" id="owner" onChange={this.handleChangeCustomer}>
                                        {this.state.selectedCustomerId != 0 ? this.state.customers.map((customer) => (
                                            <option key={customer.customerId} value={customer.customerId} >{customer.firstName} {customer.lastName}</option>
                                        ))
                                            :
                                            <option value="Se??iniz">Se??iniz</option>}
                                    </Input>
                                    :
                                    null
                                }
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
                                            <option value="Se??iniz">Se??iniz</option>}
                                    </Input>
                                    :
                                    null
                                }
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Personel</th>

                            <td>
                                {this.state.isProcessLoaded == true ?
                                    <Input value={this.state.selectedEmployeeId} type="select" name="employee" id="employee" onChange={this.handleChangeEmployee}>
                                        {this.state.selectedEmployeeId != 0 ? this.state.employees.map((employee) => (
                                        <option key={employee.employeeId} value={employee.employeeId}>{employee.firstName} {employee.lastName}</option>
                                    ))
                                            :
                                            <option value="Se??iniz">Se??iniz</option>}
                                    </Input>
                                    :
                                    null
                                }
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Durum</th>

                            <td>
                                <Input type="select" name="status" id="status" onChange={this.handleChange}>
                                    <option selected value={this.state.status} >{this.state.status}</option>
                                    <option value="Beklemede" >Beklemede</option>
                                    <option value="Devam Ediyor" >Devam Ediyor</option>
                                    <option value="Tamamland??" >Tamamland??</option>
                                    <option value="Teslim Edildi" >Teslim Edildi</option>
                                </Input>
                            </td>
                        </tr>

                        <tr>
                            <th>Te??hisler</th>

                            <td>
                                <Input type="textarea" name="diagnostics" id="diagnostics" defaultValue={this.state.diagnostics} onChange={this.handleChange}></Input>
                            </td>
                        </tr>

                    </tbody>
                </Table>


                <Button>G??ncelle</Button>
            </Form>

        )
    }

    //Kullan??lan ??r??n ekleme
    addConsumedProduct = (event) => {
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

        fetch("/api/consumedproducts/add", requestOptions)
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
                this.getConsumedProducts(this.props.getProcess);
                this.GetProcessCharge(this.props.getProcess);
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

    //Kullan??lan ??r??n ekleme formu
    addConsumedProductForm() {
        return (
            <Form onSubmit={this.addConsumedProduct}>
                <h1> Kullan??lan ??r??n Ekle</h1>
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
                            <th scope="row">??r??n Kategorisi</th>
                            <td>
                                <Input value={this.state.selectedProductCategoryId} type="select" name="productCategory" id="productCategory" onChange={this.handleChangeProductCategory}>
                                    <option selected value={0}>Se??iniz</option>
                                    {this.state.productCategories.map((category) => (
                                        <option key={category.productCategoryId} value={category.productCategoryId}>{category.name}</option>
                                    ))}
                                </Input>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">??r??n</th>
                            <td>
                                <Input value={this.state.selectedProduct} type="select" name="product" id="product" onChange={this.handleChangeProduct}>
                                    <option selected value={0}>Se??iniz</option>
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
                            <th scope="row">??ndirim Oran??</th>
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

    //Db'Den ??ekilmi?? kullan??lan ??r??nleri listeleme
    ListConsumedProducts() {
        return (
            <Table hover>
                <thead>
                    <tr>
                        <th>??r??n Kodu</th>
                        <th>??r??n</th>
                        <th>Adet</th>
                        <th>Birim Fiyat</th>
                        <th>Toplam Fiyat</th>
                        <th>??ndirim Oran??</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {this.state.consumedProducts.map((consumedProduct) => (
                        <tr key={consumedProduct.consumedProductId}>
                            <td>{consumedProduct.productCode}</td>
                            <td>{consumedProduct.product}</td>
                            <td>{consumedProduct.quantity}</td>
                            <td>{consumedProduct.unitPrice}</td>
                            <td>{consumedProduct.totalPrice}</td>
                            <td>{consumedProduct.discount}</td>
                            <td><Button onClick={this.deleteConsumedProduct.bind(this, consumedProduct.consumedProductId)} color="danger">Sil</Button></td>
                            <td><Button onClick={this.updateConsumedProduct.bind(this, consumedProduct.consumedProductId)} color="info">G??ncelle</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        )
    }

    //Kullan??lan ??r??n Silme
    deleteConsumedProduct(id) {

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };

        fetch("/api/consumedproducts/delete?id=" + id, requestOptions)
            .then(async (response) => {
                const data = await response.json();

                if (!response.ok) {
                    const error = data;
                    return Promise.reject(error);
                }

                this.getConsumedProducts(this.props.getProcess);
                this.GetProcessCharge(this.props.getProcess);
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

    //Servis Hizmeti g??ncellemek i??in Servis Hizmeti id'si g??nderen fonksiyon
    setConsumedProduct = (id) => {
        this.props.setConsumedProduct(id);
    }

    //Servis Hizmeti G??ncelleme
    updateConsumedProduct(id) {
        this.setConsumedProduct(id);
        this.props.history.push("/servis/guncelle/urun/guncelle");
    };

    render() {
        return (
            <div>
                <Row>
                    <Col md="6">
                        {this.updateProcessForm()}
                    </Col>

                    <Col md="6">
                        {this.addConsumedProductForm()}
                    </Col>
                </Row>
                <hr className="mb-3 mt-3" ></hr>
                <center><h1 className="mb-3">Toplam ??cret: {Number.parseFloat(this.state.processCharge).toFixed(2)}</h1></center>
                {this.ListConsumedProducts()}

            </div>



        );
    }
};