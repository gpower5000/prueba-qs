import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, Button } from 'react-bootstrap';

const propTypes = {
    onChangePage: PropTypes.func.isRequired,
    initialPage: PropTypes.number    
}

const defaultProps = {
    initialPage: 1
}

export class ControlledPagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pager: {}, tempPage: 1 };
    }

    handleKeyDown = (event) => {
        if (event.keyCode === 13 || event.keyCode == 9) {
            this.setPage(this.state.tempPage);
        }
    }

    changeInput = (event) => {
        const p = parseInt(event.target.value,10);
        if (p > this.props.pages) { this.setState({tempPage: this.props.pages}); }
        else if (p < 1) { this.setState({tempPage: this.props.initialPage}); }
        else { this.setState({tempPage: p}); }
    }

    componentWillMount() {
        this.setPage(this.props.initialPage, false);
    }

    resetPage( page = 1 ) {
        this.setPage(page, false);
    }

    setPage(page, callFn = true ) {
        let pages = this.props.pages;
        let pager = this.state.pager;

        if (page < 1 || page > pager.totalPages) {
            return;
        }
        if ( this.state.pager.currentPage === page) {
            return;
        }

        // get new pager object for specified page
        pager = this.getPager(pages, page);

        // update state
        this.setState({ pager: pager, tempPage: pager.currentPage });

        // call change page function in parent component
        if (callFn) {
            this.props.onChangePage(pager.currentPage);
        }
    }

    getPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 5;

        // calculate total pages
        let totalPages = totalItems;

        let startPage, endPage;
        if (totalPages <= 5) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        // calculate start and end item indexes
        let startIndex = (currentPage - 1) * pageSize;
        let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        let pages = [...Array((endPage + 1) - startPage).keys()].map(i => startPage + i);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            lastPage: (pages[pages.length-1] || null),
            pages: pages
        };
    }

    render() {
        var pager = this.state.pager;

        if (!pager.pages) {
            // don't display pager if there is only 1 page
            return null;
        }

        return (
            <React.Fragment>
                <div className="c-controlled-pagination__parent-button">
                    <div className="c-controlled-pagination__input" >
                        <input
                            type      = "number"
                            className = "form-control sm btn-sm"
                            value     = {this.state.tempPage+''}
                            min       = {1+''}
                            max       = {this.props.pages+''}
                            onChange  = {this.changeInput}
                            onKeyDown = {this.handleKeyDown}
                        />
                    </div>
                    <Button
                        variant="outline-success"
                        size="sm"
                        className="pl-3 pr-3"
                        onClick={()=>this.setPage(this.state.tempPage)}
                    >Ir</Button>
                </div>
                <Pagination size="sm" className="mb-0">
                    <Pagination.First
                        active  = {pager.currentPage === 1}
                        onClick = {() => this.setPage(1)}
                    />
                    <Pagination.Prev
                        active  = {pager.currentPage === 1}
                        onClick = {() => this.setPage(pager.currentPage - 1)}
                    />
                    {pager.pages.map((page, index) =>
                        <Pagination.Item
                            key     = {index}
                            active  = {pager.currentPage === page}
                            onClick = {() => this.setPage(page)}
                        >{page}</Pagination.Item>
                    )}
                    {pager.lastPage < pager.totalPages && 
                        <Pagination.Ellipsis />
                    }
                    <Pagination.Next
                        active  = {pager.currentPage === pager.totalPages}
                        onClick = {() => this.setPage(pager.currentPage + 1)}
                    />
                    <Pagination.Last
                        active  = {pager.currentPage === pager.totalPages}
                        onClick = {() => this.setPage(pager.totalPages)}
                    />
                </Pagination>
            </React.Fragment>
        );
    }
}

ControlledPagination.propTypes = propTypes;
ControlledPagination.defaultProps = defaultProps;
