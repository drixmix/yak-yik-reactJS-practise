import React, {Component} from 'react';
import { APIManager } from '../../utils'
import {Zone, CreateZone} from '../presentations';
import { connect } from 'react-redux';
import actions from '../../actions/actions'

class Zones extends Component {
    constructor() {
        super()
        this.state = {
            //selected: 0,
        }
    }

    componentDidMount(){
    }

    addZone(zone){
      let updatedZone = Object.assign({}, zone)
      APIManager.post('/api/zone', updatedZone, (err, response) => {
        if(err){
          alert('ERROR: ' + err.message)
          return
        }
        const zone = response.result
        this.props.zonesCreated(zone)
      })
    }

    selectZone(index){
      console.log('selectZone' + index)
      /*this.setState({
        selected : index
      })*/
      this.props.selectZone(index)
    }

    render() {
      const listItems = this.props.list.map((zone, i) => {
      let selected = (i == this.props.selected)
        return (
          <li key={i}><Zone index={i} select={this.selectZone.bind(this)} isSelected={selected} currentZone={zone}/></li>
        )
      })
        return (
            <div>
                <ol>
                  {listItems}
                </ol>
              <CreateZone onCreateZone = {this.addZone.bind(this)}/>

            </div>
        )
    }
}

const stateToProps = (state) => {
  return {
    list: state.zone.list,
    selected: state.zone.selectedZone
  }
}

const dispatchToProps = (dispatch) => {
  return {
    fetchZones: (params) => dispatch(actions.fetchZones(params)),
    zonesRecieved: (zones) => dispatch(actions.zonesRecieved(zones)),
    zonesCreated: (zone) => dispatch(actions.zonesCreated(zone)),
    selectZone: (index) => dispatch(actions.selectZone(index))
  }
}


export default connect(stateToProps, dispatchToProps)(Zones)
