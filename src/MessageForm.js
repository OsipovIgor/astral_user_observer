import React, { Component } from 'react';
import { Card, Col, Row, Button, Avatar, Icon, Breadcrumb, Input, Radio, Tabs } from 'antd';

class MessageForm extends Component {
        constructor(props) {
            super(props);
            this.state = {
                message: "",
                eventType: "success",
                limitTypeId: 1,
                availableCount: 100
            };
            
            this.send = this.send.bind(this);
            this.sendBill = this.sendBill.bind(this);
            this.onChangeMessage = this.onChangeMessage.bind(this);
            this.onChanheEventType = this.onChanheEventType.bind(this);
            this.onFieldChange = this.onFieldChange.bind(this);
        }

        send() {
            console.log("send");
            const { message, eventType } = this.state;
            const { onSendMessage } = this.props;
            onSendMessage(eventType === "success" ? message : {eventType, message});
        }
        
        sendBill() {
            const { limitTypeId, availableCount } = this.state;
            const { onSendMessage } = this.props;
            onSendMessage({
                "eventType":"billing",
                "payload": {
                    "availableCount": parseInt(availableCount),
                    "currentLicense": { limitTypeId: parseInt(limitTypeId),"startDate":"2017-08-11T09:27:38.703032","endDate":"2018-08-11T09:27:38.703032" },
                    "nextLicense":null
                }
            });
        }

        onChangeMessage(e) {
            console.log("onChangeMessage");
            this.setState({message: e.target.value});
        }

        onChanheEventType(e) {
            console.log("onChanheEventType", e.target.value);
            this.setState({eventType: e.target.value});
        }
        
        onFieldChange(field) {
            return (e) => {
                console.log("fieldChange", field, e.target.value);
                this.setState({[field]: e.target.value});
            }
        }  

        render() {

        const { sending } = this.props;
        const { eventType, limitTypeId, availableCount } = this.state;
        return (
            <div> 
                <Tabs defaultActiveKey="1">
                    <Tabs.TabPane tab={<span><Icon type="meh" /> Сообщение</span>} key="1">
                        <Input.TextArea placeholder="payload" autosize={{ minRows: 2, maxRows: 6 }} onChange={this.onChangeMessage}/>
                        <Row style={{ marginTop: 16 }}>
                            <Col span={18}>
                                <Radio.Group value={eventType} onChange={this.onChanheEventType}>
                                    <Radio.Button value="success">Успех</Radio.Button>
                                    <Radio.Button value="info">Инфо</Radio.Button>
                                    <Radio.Button value="error">Ошибка</Radio.Button>
                                </Radio.Group>
                            </Col>
                            <Col span={6} style={{ textAlign: "right" }}>
                                <Button type="primary" loading={sending} onClick={this.send}>
                                    Отправить!
                                </Button>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab={<span><Icon type="shopping-cart" /> Счетчик билинга</span>} key="2">
                        <Row style={{ marginTop: 16 }}>
                            <Col span={6}>
                                Тариф:
                                <Radio.Group value={limitTypeId} onChange={this.onFieldChange("limitTypeId")} style={{marginLeft:10}}>
                                    <Radio.Button value="2">Лимитный</Radio.Button>
                                    <Radio.Button value="1">Безлимитный</Radio.Button>
                                </Radio.Group>
                            </Col>
                            <Col span={10}>
                                <span>Доступные отправки:</span> <Input value={availableCount} onChange={this.onFieldChange("availableCount")} style={{marginLeft:10, width:200}}/>
                            </Col>
                            <Col span={2}>
                                
                            </Col>
                            <Col span={6} style={{ textAlign: "right" }}>
                                <Button type="primary" loading={sending} onClick={this.sendBill}>
                                    Отправить!
                                </Button>
                            </Col>
                        </Row>
                    </Tabs.TabPane>
                </Tabs>
                
            </div>
        );
        }
};

export default MessageForm;