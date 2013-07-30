var Movie = Backbone.Model.extend();

var MovieCollection = Backbone.Collection.extend({
  model: Movie
, url: '/movies'
});

var MovieView = Backbone.View.extend({
  template: _.template($('#movie').html())
, render: function() {
    return this.template(this.model.toJSON());
  }
});

var AppView = Backbone.View.extend({
  el: '.container'
, events: {
    'click #add': 'addMovie'
  }
, initialize: function() {
    this.render();
  }
, render: function() {
    this.model.fetch({ success: _.bind(this.renderChildren, this) });
    return this;
  }
, renderChildren: function() {
    _.each(this.model.models, function(movie) {
      this.$el.append(new MovieView({ model: movie }).render());
    }, this);
    return this;
  }
, addMovie: function(e) {
    e.preventDefault && e.preventDefault();
    // TODO: add a new movie here.
    return false;
  }
})

appView = new AppView({ model: new MovieCollection() });
