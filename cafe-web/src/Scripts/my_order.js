import React from 'react';
import posts from './Posts';
import ReactDOM from 'react-dom'
import OrderSummery from './OrderSummery';
import '../Styles/orderSummery.css';


class My_order extends React.Component{
    constructor(props) {
        super(props);
        this.state = {EmpName:"",
                      user:1,
                      EmpId:0,
                      EmpPhone:0,
                    total:0,
                    posts :posts,
                  qty:0 ,
                  data:[{ "snack_id":0,
                      "name":"",
                     "qty": 0,
                    "price":0,
                     "total":0,}],};
        this.handleChange = this.handleChange.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onAddItem = this.onAddItem.bind(this)
    this.onChangeQty = this.onChangeQty.bind(this)
    this.onChangePrice = this.onChangePrice.bind(this)
    this.CalculateTotal = this.CalculateTotal.bind(this)
    this.SetId = this.SetId.bind(this)
    this.SetName = this.SetName.bind(this)
    this.SetPhone = this.SetPhone.bind(this)
    this.SaveOrderDetails = this.SaveOrderDetails.bind(this)
    
    


      }
      
      onAddItem() {
        //this.setState(state => {
       // const list = state.list.concat(state.value);})
       this.setState({ list: this.state.list.concat(6) })
         }
    
      handleChange(event) {
       // this.setState({value: event.target.value});
        this.setState({qty: event.target.value});



      }


      onChangeQty(e,index){
      //  let value = e.target.value
      let value = e.target.value
    
      this.setState((state)=>{
    
          let postTemp = state.data
          postTemp[index].qty = value
          
          postTemp[index].total=postTemp[index].qty*postTemp[index].price
        this.CalculateTotal()
            return{
              ...state,
              posts:postTemp
            }
        })
    }

    onChangePrice(e,index){
        let value = e.target.value
      let name=""
      let price=0
      posts.map((post)=>
    {  if(post.id==e.target.value)
      {price=post.price
      name=post.title }
    }
      )
      this.setState((state)=>{
    
          let postTemp = state.data
          
          postTemp[index].price = price
          postTemp[index].name = name
          postTemp[index].snack_id = value
          
            return{
              ...state,
              posts:postTemp
            }
        })
    }


      onChangeValue = event => {
        this.setState({ value: event.target.value });
        this.setState({ list: this.state.list.concat(6) });
        console.log(this.state.list)
      };


          handleAddShareholder = () => {
            this.state.data.push({
                 "snack_id":0,
                "name":"",
                "qty": 0,
                "price":0,
                "total":0,
            })
            this.setState({data:this.state.data})
          };

        CalculateTotal()
        {let Sum=0;
            this.state.data.map((post)=>(
              Sum=Sum+post.total
            )
            )
              this.setState({total:Sum})
            console.log(this.state.EmpId);
            console.log(this.state.EmpName);
            console.log(this.state.EmpPhone);

            

        }

  
        removePeople(index) {
          var array = [...this.state.data]; // make a separate copy of the array
         // var index = array.indexOf(e.target.value)
          if (index !== 0) {
            array.splice(index, 1);
            this.setState({data: array});
            let Sum=0;
            array.map((post)=>(
              Sum=Sum+post.total
            )
            )
              this.setState({total:Sum})
          }
          console.log(this.state.data)
      //    this.CalculateTotal()
        }   

        SetId(e)
        {
          this.setState({EmpId: e.target.value})
        }

        SetName(e)
        {
          this.setState({EmpName:e.target.value})
        }
        datee() {
          var x = new Date();
          var y = x.getFullYear().toString();
          var m = (x.getMonth() + 1).toString();
          var d = x.getDate().toString();
          (d.length == 1) && (d = '0' + d);
          (m.length == 1) && (m = '0' + m);
          var yyyymmdd = y +"-"+ m +"-"+ d;
          return yyyymmdd;
          }

        SetPhone(e)
        {
          this.setState({EmpPhone:e.target.value})
        }

        SaveOrderDetails() {
          fetch('http://localhost:8080/user/order/save', {
                         //https://jsonplaceholder.typicode.com/posts
            method: 'POST',
            //mode:'no-cors',
            headers: {
              
              "Content-type": "application/json; charset=UTF-8"
              
            },
            body: JSON.stringify({
              emp_id: this.state.EmpId,
          emp_name: this.state.EmpName,
          cart_id: null,
          ph_no: this.state.EmpPhone,
          Snack: this.state.data,
          datetime: this.datee(),
          total: this.state.total,
          tnx_id: "627832862786483644535",
          payment_status: "pending"
            }),
          }).then(response => {
                  console.log(response)
              return response.text()
            }).then(json => {
              this.setState({ 
                user: json
              }, () => {
                this.newpage();
              });
            });
                      
        }
        newpage = ()=>ReactDOM.render(<OrderSummery orderSummaryData ={this.state.data} 
          orderId = {this.state.user} OrderTotal={this.state.total}
          EmployeeId = {this.state.EmpId} EmployeeContact = {this.state.EmpPhone} />, document.getElementById('root'));
        

 render()    
{
    return (
      <div><center>
                    <img src="https://www.incedoinc.com/templates/common/images/logo.svg" alt="" width="50%"></img>
        <br/><br/><br/>
        <table>
        <tr><td><label>Emp Id</label></td><td><input type="text" name="empId" onChange={this.SetId}></input></td>
        <td><label>Emp name</label></td><td><input type="text" name="empname" onChange={this.SetName}></input></td>
        <td><label>contact no.</label></td><td><input type="text" name="contactNo." onChange={this.SetPhone}></input></td></tr>
        </table>
       <table id ="customers">
         <tr>
                    <th> ADD</th>
                    <th>Menu </th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Remove</th>
            </tr>
           { this.state.data.map((post,index)=> 
          <tr>
                 <td>   <button class=" form-control col-sm-1 offset-sm-1 text-center" type="button"  onClick={this.handleAddShareholder}    > +</button> </td>

                 <td>   <select 
               onChange={(e)=>this.onChangePrice(e,index)}>
                        <option value="" disabled selected>Select your option</option>
                        {
                            posts.map(post => (
                          !post.is_active? "" : <option name='price' onChange={(e)=>this.onChangePrice(e,index)} value={post.id}>{post.title}</option> 
                           
                            ))
                        }
                            </select>  </td>

                            <td>    <input type="number"  class="form-control col-sm-2 text-center" min="0" name='qty' onChange={(e)=>this.onChangeQty(e,index)} /> </td>
                            <td>    <input   class="form-control col-sm-2 text-center" value={post.price} readonly/>  </td>
                            <td>    <input  class="form-control col-sm-2 text-center" value={post.total} readonly/>  </td>
                            <td>    <button type="button" class="form-control col-sm-1 text-center" onClick={() => this.removePeople(index)}> -</button>  </td>
                     
                        
        </tr>)}

           </table>
                        <div  > Total: {this.state.total} </div>
            <button id="customer_button" onClick={this.SaveOrderDetails}>Save data</button>
            </center>
           </div>     
            );
        
}

}

export default My_order;