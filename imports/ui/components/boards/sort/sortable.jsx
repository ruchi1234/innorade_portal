import React from 'react';
import ReactDOM from 'react-dom';
import { _ } from 'meteor/underscore';
import BoardProducts from '/imports/modules/clips/collection';
import { CalculateQuery } from '/imports/modules/calculate_query';
import Row from '/imports/ui/components/grid/row';
import Col from '/imports/ui/components/grid/col';
import Img from '/imports/ui/components/img';
import Counts from '/imports/ui/components/counts';

const {
    DEFAULT_LIMIT,
    DEFAULT_INFINITE_SCROLL_OFFSET,
} = Mavenx.globals;
import Subscriptions from '/imports/data/subscriptions';

const BoardProductsSortable = React.createClass({
  propTypes: {
    boardProducts: React.PropTypes.array.isRequired,
    loadMore: React.PropTypes.func,
    cleanup: React.PropTypes.func,
    finalCleanup: React.PropTypes.func,
  },

  mixins: [SortableMixin],

  /*
   * Setup infinite scroll stuff
   */
  componentDidMount() {
    ReactDOM.findDOMNode(this).addEventListener('scroll', this.handleScroll);
  },

  /*
   * TODO
   * This goes away when 1.3 + komposer
   */
  componentWillReceiveProps() {
    this.props.cleanup();
  },

  componentWillUnmount() {
    this.props.cleanup();
    this.props.finalCleanup();
    ReactDOM.findDOMNode(this).removeEventListener('scroll', this.handleScroll);
  },

  /*
   * When sortable changes the order, update the collection to reflect
   * this change.
   */
  onUpdate(evt) {
    const bproductId = evt.item.getAttribute('data-board-product-id');
    const { newIndex } = evt;

    const product = BoardProducts.findOne({ _id: bproductId });
    product.move(newIndex);
  },

  handleScroll(e) {
    if ((e.target.scrollHeight - e.target.clientHeight - DEFAULT_INFINITE_SCROLL_OFFSET) < e.target.scrollTop) {
      this.props.loadMore();
    }
  },

  /*
   * Define options for the sortable plugin
   */
  sortableOptions: {
    ref: 'boardProducts',
    model: 'boardProducts',

    onEnd: 'onEnd',
    onUpdate: 'onUpdate',
    ghostClass: 'sortable-ghost',  // Class name for the drop placeholder
    chosenClass: 'sortable-chosen',
  },

  render() {
    const { boardProducts } = this.props;
    return (
      <section
        className="productSort">
        <h4>
          Arrange Products
        </h4>
        <p>
          Re-order or delete product clippings below.
        </p>
        <ul
          ref="boardProducts"
          className="sortable">
          {
            boardProducts.map((p) => {
              const removeProduct = () => {
                const yes = confirm(
                  'The product you have selected will be removed from the board.'
                   + 'Please confirm below.'
                );
                if (yes) {
                  p.remove();
                }
              };

              const favCount = _.get(p, 'favoritedByIds') && _.get(p, 'favoritedByIds').length || 0
              /*
               * Really hate the use of data-product-id
               * but not much of a better way to do it
               * other than to assume index === sort value
               * which would be brittle
               */
              return (
                <li
                  key={p._id}
                  data-board-product-id={p._id}
                  className="product-sort-list-item"
                  draggable
                >
                  <Row>
                    <Col>
                      <i className="fa fa-th" aria-hidden="true"></i>
                    </Col>
                    <Col>
                      <Img
                        className="img-responsive"
                        role="presentation"
                        src={_.get(p, 'images.0.href') || ''}
                      />
                    </Col>
                    <Col className="productDescription">
                      <p className="clamp clamp-2 title">
                        {p.title}
                      </p>
                      <Counts favorites={favCount} price={p.price} />
                    </Col>
                    <Col>
                      <span
                        onClick={removeProduct}
                      >
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                      </span>
                    </Col>
                  </Row>
                </li>
              );
            }
          )
        }
        </ul>
      </section>
    );
  },
});

const page = new ReactiveVar(1);
const QUERY_HELPERS = ['sorted', 'byBoardId'];
const BoardProductsSortableWData = MeteorData(BoardProductsSortable, {
  getData(props) {
    // console.log('BoardProductsSortable', props);
      /*
       * If no boardId found do nothing
       */
    if (!props.boardId) { return { boardProducts: [], cleanup() {}, finalCleanup() {} }; }

    /*
     * Subscribe to each
     */
    const subs = [];
    _.times(page.get(), (i) => {
      subs.push(Subscriptions.subscribe('boardProductsByBoardId', props.boardId, QUERY_HELPERS, i));
    });

    const maxReturnCount = DEFAULT_LIMIT * page.get();
    const params = {
      boardId: props.boardId,
      userId: Meteor.userId(),
    };
    const query = CalculateQuery(BoardProducts.queryHelpers, QUERY_HELPERS, params);
    query[1].limit = maxReturnCount;
    const boardProducts = BoardProducts.find(...query).fetch();
    return {
      boardProducts,
      loadMore() {
        if (maxReturnCount === boardProducts.length) {
          page.set(page.get() + 1);
        }
      },
      cleanup() {
        _.each(subs, (sub) => {
          sub.stop();
        });
      },
      finalCleanup() {
        page.set(1);
      },
    };
  },
});

export default BoardProductsSortableWData;
