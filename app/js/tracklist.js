import React, {Component} from 'react';
import {
    Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn
} from 'material-ui';
import {connect} from 'react-redux';

const action = require('./action/a_music');


class TrackList extends Component {

    static propTypes = {
        trackList: React.PropTypes.object,
    }

    fileZero(num) {
        if (num < 10) {
            return "0" + num;
        }
        return num + "";
    }

    formatDate(length) {
        if (!length) {
            return "";
        }

        let m = this.fileZero(parseInt(length / 60));
        let s = this.fileZero(length % 60);

        return `${m}:${s}`;

    }

    renderItem() {
        let {trackList}=this.props;

        if (!trackList.list || trackList.list.length == 0) {
            return <TableRow>
                <TableRowColumn colSpan={5} style={{textAlign: 'center'}}>暂无曲目</TableRowColumn>
            </TableRow>;
        }


        return trackList.list.map((n, i) => {
                return <TableRow key={"track" + i}>
                    <TableRowColumn style={styles.col_no}>{(i+1)}</TableRowColumn>
                    <TableRowColumn>{n.name}</TableRowColumn>
                    <TableRowColumn style={styles.col_length}>{this.formatDate(n.length)}</TableRowColumn>
                    <TableRowColumn style={styles.col_size}>{n.size}</TableRowColumn>
                    <TableRowColumn style={styles.col_times}>{n.times}</TableRowColumn>
                    <TableRowColumn style={styles.col_op}>{n.times}</TableRowColumn>
                </TableRow>;
            }
        )
    }

    render() {
        return (
            <Table
                wrapperStyle={{display: 'flex', flexDirection: 'column', flex: 1,}}
                bodyStyle={{flex: 1}}
                selectable={true}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={styles.col_no}>序号</TableHeaderColumn>
                        <TableHeaderColumn>曲目</TableHeaderColumn>
                        <TableHeaderColumn style={styles.col_length}>时长</TableHeaderColumn>
                        <TableHeaderColumn style={styles.col_size}>大小</TableHeaderColumn>
                        <TableHeaderColumn style={styles.col_times}>次数</TableHeaderColumn>
                        <TableHeaderColumn style={styles.col_op}>操作</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {this.renderItem()}
                </TableBody>
            </Table>
        );
    }
}

const styles = {
    col_no: {
        width: 10,
    },
    col_size: {
        width: 50,
    },
    col_length: {
        width: 35,
    },
    col_op: {
        width: 10
    },
    col_times: {
        width: 10
    },
}


function mapStateToProps(state, props) {
    return {
        trackList: state.trackList,
    }
}

function mapActionToProps(dispatch, props) {

    return {}
}


module.exports = connect(mapStateToProps, mapActionToProps)(TrackList);