import React from 'react';
import ReactDOM from 'react-dom'
import OrderSummery from './OrderSummery'
import '../Styles/orderSummery.css';
import App from '../App';

class Status extends React.Component{
constructor(props){
    super(props);
    this.state = {status:"",
                }
}
componentDidMount() {
    const orderId = localStorage.getItem('orderId');
    fetch("http://localhost:8080/user/order/fetchStatus?orderId="+orderId+"", {

        method:"GET"
    }).then(response => {
console.log(response)
            return response.text()
        }).then(json => {
            this.setState({ 
                status:json
            });
        });
}
render(){
    return(
        <div><br/><br/><br/><br/><br/><br/><br/>
            <center>
    <img src="https://www.incedoinc.com/templates/common/images/logo.svg" alt="" width="50%"></img>
    <h1 color ='blue'  >{this.state.status}</h1>
    <button id ="customer_button"  onClick ={()=>ReactDOM.render(<App/>, document.getElementById('root'))}>HOME</button>
    </center>
    </div>
    )
}
}


export default Status;

