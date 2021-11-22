import React, { Component } from 'react';
import axios from 'axios';
import Header from '../templates/Header.js';
import Footer from '../templates/Footer.js';
import Loader from '../blocks/Loader.js';
import { API_BASE_URL } from '../config'
import { motion } from "framer-motion";
import {Line} from 'react-chartjs-2';

class Order extends Component {
    
    constructor(props) {
        super();
        
        this.state = {
            isLoaded: false,
            isLoggedIn: false,
            user: {},
            lifetimereport: [],
            monthlyreport: [],
            mostselling: []
        }

        this.getLifetimeReport = this.getLifetimeReport.bind(this);
        this.getMonthlySaleReport = this.getMonthlySaleReport.bind(this);
        this.getMostSelling = this.getMostSelling.bind(this);
    }

    async componentDidMount() {
        let state = localStorage["appState"];
        
        if (state) {
            let AppState = JSON.parse(state);
            await this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user, isLoaded: true});
            this.getLifetimeReport();
            this.getMonthlySaleReport();
            this.getMostSelling();
        }
    }

    async getLifetimeReport() {
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/reports/lifetimereport', { headers: { Authorization: AuthStr } })
        .then(response => {
            this.setState({isLoaded: true, lifetimereport: response.data.data });
        })
        .catch(function (error) {
        });
    }

    async getMonthlySaleReport() {
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/reports/monthlyreport', { headers: { Authorization: AuthStr } })
        .then(response => {
            this.setState({isLoaded: true, monthlyreport: response.data.data });
        })
        .catch(function (error) {
        });
    }

    async getMostSelling() {
        this.setState({isLoaded: false});
        const AuthStr = 'Bearer '.concat(this.state.user.access_token); 
        axios.get(API_BASE_URL + '/reports/mostselling', { headers: { Authorization: AuthStr } })
        .then(response => {
            this.setState({isLoaded: true, mostselling: response.data.data });
        })
        .catch(function (error) {
        });
    }


    handleShow() {
        return false;
    }

    render() {
        
        const { error, isLoaded, mostselling, monthlyreport, lifetimereport } = this.state;
        
        let monthlyLabels = [],
            monthlyValues = [];

        if ( monthlyreport ) {
            monthlyreport.map((item) => {
                monthlyLabels.push(item.month)
                monthlyValues.push(item.sale)  
                return false;
            });
        }
        

        var lineChart = {
          labels: monthlyLabels,
          datasets: [
            {
              label: "Total Sales",
              fill: true,
              lineTension: 0.1,
              backgroundColor: 'rgba(75,192,192,0.1)',
              borderColor: 'rgba(75,192,192,1)',
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: 'rgba(75,192,192,1)',
              pointBorderWidth: 5,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: 'rgba(75,192,192,1)',
              pointHoverBorderColor: 'rgba(220,220,220,1)',
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              steppedLine: false,
              data: monthlyValues
            }
          ],
        }

        var options = {
            maintainAspectRatio: true,
            fullWidth: true,
            title: {
                display: true,
                text: 'Sales by month'
            }
        }

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return (
                <div>
                    <Header />
                        
                        <div className="page-wrapper grid">
                            <Loader isLoading={true} /> 
                        </div>

                    <Footer />
                </div>
            );

        } else {
            return (
                <div>
                    <Header />
                        
                    <div className="page-wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 mt-3 mb-3">
                                    <div className="order-item-wrapper">
                                        <motion.div
                                            animate={{
                                              scale: [0, 1]
                                            }}
                                            transition={{ duration: 0.1 }}
                                            className="card" 
                                        >
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div  className="order-detail">
                                                            <div className="order-detail-head">Total Sales</div>
                                                            <div className="order-detail">
                                                                <strong>{lifetimereport.lifetimesale &&
                                                                    lifetimereport.lifetimesale.toFixed(2)
                                                                } PKR</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 col-lg-4 mb-3">
                                                        <div  className="order-detail">
                                                            <div className="order-detail-head">Total Frames Sold</div>
                                                            <div className="order-detail">
                                                                <strong>{lifetimereport.lifetimeframe &&
                                                                    lifetimereport.lifetimeframe
                                                                }</strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div class="col-6 small-boxes vertical">
                                    <motion.div
                                            animate={{
                                              scale: [0, 1]
                                            }}
                                            transition={{ duration: 0.1 }}
                                            className="card" 
                                    >
                                        <Line data={lineChart} fullWidth={true} height={100} options={options} legend={false} tooltips={false} />
                                    </motion.div>
                                </div>
                                <div class="col-6 small-boxes vertical">
                                    <motion.div
                                            animate={{
                                              scale: [0, 1]
                                            }}
                                            transition={{ duration: 0.1 }}
                                            className="card" 
                                        >
                                            <div className="card-body">
                                                <h5 className="card-title mb-3">Best Selling</h5>
                                                
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Frame</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        { mostselling &&
                                                            mostselling.map((item, key) => 
                                                                <tr>
                                                                    <td>{key + 1}</td>
                                                                    <td>{item.name}</td>
                                                                    <td>{item.total} Frames</td>
                                                                </tr>
                                                            )
                                                        }
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                            
                                        </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Order; // Don’t forget to use export default!