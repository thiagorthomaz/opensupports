import React from 'react';
import {connect}  from 'react-redux';

import i18n from 'lib-app/i18n';

import AdminDataAction from 'actions/admin-data-actions';
import TicketList from 'app-components/ticket-list';

import Header from 'core-components/header';
import SearchBox from 'core-components/search-box';
import Message from 'core-components/message';

class AdminPanelAllTickets extends React.Component {

    static defaultProps = {
        departments: [],
        tickets: []
    };

    state = {
        page: 1,
        query: ''
    };

    componentDidMount() {
        this.props.dispatch(AdminDataAction.retrieveAllTickets());
    }

    render() {
        return (
            <div className="admin-panel-my-tickets">
                <Header title={i18n('ALL_TICKETS')} description={i18n('ALL_TICKETS_DESCRIPTION')} />
                <div className="admin-panel-my-tickets__search-box">
                    <SearchBox onSearch={this.onSearch.bind(this)} />
                </div>
                {(this.props.error) ? <Message type="error">{i18n('ERROR_RETRIEVING_TICKETS')}</Message> : <TicketList {...this.getTicketListProps()}/>}
            </div>
        );
    }

    getTicketListProps() {
        return {
            showDepartmentDropdown: false,
            departments: this.props.departments,
            tickets: this.props.tickets,
            type: 'secondary',
            loading: this.props.loading,
            ticketPath: '/admin/panel/tickets/view-ticket/',
            onPageChange: this.onPageChange.bind(this),
            page: this.state.page,
            pages: this.props.pages
        };
    }

    onSearch(query) {
        this.setState({query, page: 1});

        if(query) {
            this.props.dispatch(AdminDataAction.searchTickets(query));
        } else {
            this.props.dispatch(AdminDataAction.retrieveAllTickets());
        }
    }

    onPageChange(event) {
        this.setState({page: event.target.value});

        if(this.state.query) {
            this.props.dispatch(AdminDataAction.searchTickets(this.state.query, event.target.value));
        } else {
            this.props.dispatch(AdminDataAction.retrieveAllTickets(event.target.value));
        }
    }
}

export default connect((store) => {
    return {
        departments: store.session.userDepartments,
        tickets: store.adminData.allTickets,
        pages: store.adminData.allTicketsPages,
        loading: !store.adminData.allTicketsLoaded,
        error: store.adminData.allTicketsError
    };
})(AdminPanelAllTickets);
