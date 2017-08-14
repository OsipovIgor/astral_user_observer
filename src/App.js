import React, { Component } from 'react';
import axios from "axios";
import { Card, Col, Row, Button, Avatar, Icon, Breadcrumb, Input, Radio, message } from 'antd';
import MessageForm from "./MessageForm";
import logo from './logo.svg';
import './App.css';

const messageService = message;

const API_ADDRESS="http://localhost:3228"

class App extends Component {
  constructor(props) {
    super(props);

    this.refreshData=this.refreshData.bind(this); 
    this.onShowSendForm=this.onShowSendForm.bind(this); 
    this.onHideSendForm=this.onHideSendForm.bind(this); 
    this.onSendMessage=this.onSendMessage.bind(this); 
    this.state = {
        users: [],
        abonents: [],
        loading: true,
        showSending: false,
        sending: false
    };
  }

  componentDidMount() {
     this.refreshData(); 
  } 

  onShowSendForm(target) {
    return () => this.setState({showSending:true, target})
  }

  onHideSendForm() {
    this.setState({showSending:false});
  }

  onSendMessage(message) {
        const { target } = this.state;
        const data = { [this.getUserOrAbonentByTarget(target).paramname]: target }
        console.log("sendMessageToTarget", message);
        this.setState({sending: true});
        axios.post(`${API_ADDRESS}/send_${this.getUserOrAbonentByTarget(target).methodname}`, {...data, "event": message})
          .then(r=> { 
            this.setState({sending: false});
            messageService.success('Сообщение успешно отправлено');
          })
          .catch(e=>{
            messageService.error('При отправке сообщения произошла ошибка');
            this.setState({sending: false});
            console.log(e);
          });
  }

  getUserOrAbonentByTarget(target) {
      return target.length===36 
        ? {
            paramname: "abonentGuid",
            methodname: "abonents"
          } 
        : {
            paramname: "username",
            methodname: "users"
        }

  }

  refreshData() {
    axios.all([
      axios.get(`${API_ADDRESS}/users`),
      axios.get(`${API_ADDRESS}/abonents`)
    ]).then(([users, abonents]) => {
        console.log(users.data, abonents.data);
        this.setState({ 
          users: users.data, 
          abonents: abonents.data,
          loading: false
        });
      })
      .catch(e => {
        console.log(e);
        this.setState({loading:false});
      });
  }

  render() {
    const { loading, users, abonents, showSending, sending } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2 style={{color: '#fff'}}>SOCKET-SERVICE111</h2>
        </div>
        <p className="App-intro">
        <Row style={{marginTop: 10}}>
          <Col span={4}></Col>
          { !showSending && <Col span={16}>
                <Row>
                  <Col span={11}>
                    <Card title="Пользователи" bordered loading={loading}>
                    {
                      (!users.length && ("Нет подключенных пользователей"))
                      || users.map(user => <Button type="primary" ghost onClick={this.onShowSendForm(user)}><Icon type="user" />{user}</Button>)
                    }
                    </Card>
                  </Col>
                  <Col span={2}></Col>
                  <Col span={11}>
                    <Card title="Абоненты" bordered loading={loading}>
                      { 
                        (!abonents.length && ("Нет подключенных пользователей"))
                        || abonents.map(abonent => <Button type="primary" ghost onClick={this.onShowSendForm(abonent)}><Icon type="api" />{abonent}</Button> )
                      }
                    </Card>
                  </Col>
                </Row>
          </Col> 
          }
          {
            showSending && <Col span={16}>
                <Card title={`Отправка сообщения ${this.state.target.length === 36 ? "абоненту" : "пользователю"} ${this.state.target}`} bordered style={{textAlign:"left"}} extra={<a href="#" onClick={this.onHideSendForm}>Отмена</a>}>    
                  <MessageForm onSendMessage={this.onSendMessage} sending={sending}/>
                </Card>
              </Col>
          }
          <Col span={4}></Col>
        </Row>
         
            
        </p>
      </div>
    );
  }
}

export default App;
