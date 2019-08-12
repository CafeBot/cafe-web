import React from 'react';
import '../Styles/orderSummery.css';
import Status from './Status';

class OrderSummery extends React.Component {

  constructor(props){
      super(props);
      this.state = { //state is by default an object
        students:this.props.orderSummaryData,
        orderId:this.props.orderId,
        EmployeeId : this.props.EmployeeId,
        EmployeeContact : this.props.EmployeeContact,
        OrderTotal : this.props.OrderTotal,
     }
     localStorage.setItem('orderId', this.props.orderId);
console.log(this.props.orderId)
  }
  renderTableData() {
    return (
        this.state.students.map((student, index) => {
       const {  name, qty, price,total } = student //destructuring
       return (
          <tr key={index}>
             <td>{index+1}</td>
             <td>{name}</td>
             <td>{qty}</td>
             <td>{price}</td>
             <td>{total}</td>
          </tr>
       )
    })
    )
 }

  
    render() { 
        const Link="http://localhost:8080/user/order/payDirectPaytm?emp_id="+this.state.EmployeeId+"&cart_id="+this.state.orderId+"&total="+this.state.OrderTotal+"&ph_no="+this.state.EmployeeContact+"";
        return (
            <div>
            <center>
            <img src="https://www.incedoinc.com/templates/common/images/logo.svg" alt="" width="50%"></img>
            <table id='customers'>
               <tbody>
               <tr  id="customers"><th>Id</th><th>Snack</th><th>qty</th><th>price</th><th>total</th></tr>

                  {this.renderTableData()}
               </tbody>
            </table>
                    
                <br/><br/>
				<a href ={Link}><center><button id ="customer_button">Pay</button></center></a>
                </center>
            </div>
        )
    }

}

export default OrderSummery;