$(function() {
  function globalNavDropdown( element ) {
    this.element = element;
    this.mainNavigation = this.element.find('.navSection.primary');
    this.mainNavigationItems = this.mainNavigation.find('.hasDropdown');
    this.dropdownRoot = this.element.find('.dropdownRoot');
    this.dropdownContainer = this.dropdownRoot.find('.dropdownContainer');
    this.dropdownWrappers = this.dropdownRoot.find('.dropdownSection');
    this.dropdownItems = this.dropdownRoot.find('.dropdownContent');
    this.dropdownBg = this.dropdownRoot.find('.dropdownBackground');
    this.links = this.dropdownRoot.find('.linkGroup li a');
    this.mq = this.checkMq();
    this.bindEvents();
    this.translateX;
    this.dropdownWidth;
    this.dropdownHeight;
  }

  globalNavDropdown.prototype.checkMq = function() {
    //check screen size
    var self = this;
    if ($(window).width() >= 992) {
      return ["desktop"]
    }else {
      return ["mobile"]
    }
  };

  globalNavDropdown.prototype.bindEvents = function() {
    var self = this;

    //hover over an item in the main navigation
    this.mainNavigationItems.mouseenter(function(event){
      //hover over one of the nav items -> show dropdown
      self.showDropdown($(this));
    }).mouseleave(function(){
      setTimeout(function(){
        //if not hovering over a nav item or a dropdown -> hide dropdown
        if( self.mainNavigation.find('.hasDropdown:hover').length == 0 && self.element.find('.dropdownContainer:hover').length == 0 ) {
          self.hideDropdown();
        }
      }, 50);
    });
    
    //hover over the dropdown
    this.dropdownContainer.mouseleave(function(){
      setTimeout(function(){
        //if not hovering over a dropdown or a nav item -> hide dropdown
        (self.mainNavigation.find('.hasDropdown:hover').length == 0 && self.element.find('.dropdownContainer:hover').length == 0 ) && self.hideDropdown();
      }, 50);
    });

    //click on an item in the main navigation -> open a dropdown on a touch device
    this.mainNavigationItems.on('touchstart', function(event){
      var selectedDropdown = self.dropdownContainer.find('#'+$(this).data('dropdown'));
      if( !self.element.hasClass('dropdownActive') || !selectedDropdown.hasClass('active') ) {
        event.preventDefault();
        self.showDropdown($(this));
      }
    });
  };

  globalNavDropdown.prototype.showDropdown = function(item) {
    this.mq = this.checkMq();
    if( this.mq == 'desktop') {
      var self = this;
      var selectedDropdown = this.dropdownContainer.find('[data-dropdown='+item.data('dropdown')+']'),
        selectedDropdownHeight = selectedDropdown.children('.dropdownContent').innerHeight(),
        selectedDropdownWidth = selectedDropdown.children('.dropdownContent').innerWidth();
        selectedDropdownLeft = item.offset().left + item.innerWidth()/2 - selectedDropdownWidth/2;

      //dropdown offscreen
      if(Math.sign(selectedDropdownLeft) === -1) {
        if(selectedDropdownWidth >= $(window).width()) {
          selectedDropdown.children('.dropdownContent').addClass('dropdownContent-fullWidth')
          selectedDropdownWidth = $(window).width();
        }else {
          selectedDropdown.children('.dropdownContent').removeClass('dropdownContent-fullWidth')
        }
        selectedDropdownLeft = 0;
      }else {
        if(selectedDropdownLeft + selectedDropdownWidth >=$(window).width()) {
          selectedDropdownLeft = $(window).width() - selectedDropdownWidth
        }
      }

      //update dropdown position and size
      selectedDropdown.children('.dropdownContent').css({
        'width': selectedDropdownWidth+'px',
        'height': selectedDropdownHeight+'px'
      });

      this.updateDropdown(selectedDropdown, parseInt(selectedDropdownHeight), selectedDropdownWidth, parseInt(selectedDropdownLeft));
      //add active class to the proper dropdown item
      this.element.find('.active').removeClass('active');
      selectedDropdown.addClass('active').removeClass('left right').prevAll().addClass('left').end().nextAll().addClass('right');
      item.addClass('active');
      //show the dropdown wrapper if not visible yet
      if( !this.element.hasClass('dropdownActive') ) {
        setTimeout(function(){
          self.element.removeClass('noDropdownTransition').addClass('dropdownActive');
        }, 10);
      }
    }
  };

  globalNavDropdown.prototype.updateDropdown = function(dropdownItem, height, width, left) {
    this.dropdownContainer.css({
      '-moz-transform': 'translateX(' + left + 'px)',
      '-webkit-transform': 'translateX(' + left + 'px)',
      '-ms-transform': 'translateX(' + left + 'px)',
      '-o-transform': 'translateX(' + left + 'px)',
      'transform': 'translateX(' + left + 'px)',
      'width': width+'px',
      'height': height+'px'
    });

    this.dropdownBg.attr('class', 'dropdownBackground');
    this.dropdownBg.addClass(dropdownItem.data('dropdown'))
    this.dropdownBg.css({
      '-moz-transform': 'translateX(' + left + 'px) scaleX(' + width + ') scaleY(' + height + ')',
      '-webkit-transform': 'translateX(' + left + 'px) scaleX(' + width + ') scaleY(' + height + ')',
      '-ms-transform': 'translateX(' + left + 'px) scaleX(' + width + ') scaleY(' + height + ')',
      '-o-transform': 'translateX(' + left + 'px) scaleX(' + width + ') scaleY(' + height + ')',
      'transform': 'translateX(' + left + 'px) scaleX(' + width + ') scaleY(' + height + ')'
    });

    //store the original settings 
    this.translateX = left;
    this.dropdownWidth = width;
    this.dropdownHeight = height;
  };

  globalNavDropdown.prototype.hideDropdown = function() {
    this.mq = this.checkMq();
    if( this.mq == 'desktop') {
      this.element.removeClass('dropdownActive').addClass('noDropdownTransition').find('.left').removeClass('left').end().find('.right').removeClass('right');
    }
  };
  
  globalNavDropdown.prototype.resetDropdown = function() {
    this.mq = this.checkMq();
    if( this.mq == 'mobile') {
      this.dropdownContainer.removeAttr('style');
    }
  };
  

  var globalNavDropdowns = [];
  $('.globalNav').each(function(){
    globalNavDropdowns.push(new globalNavDropdown($(this)));
  });

  function updateDropdownPosition() {
    globalNavDropdowns.forEach(function(element){
      element.resetDropdown();
    });

    resizing = false;
  };

  var resizing = false;
  updateDropdownPosition();
  
  $(window).on('resize', function(){
    if( !resizing ) {
      resizing =  true;
      if($('.globalNav').hasClass('mobileNavActive')) {
        $('.mobileNavActive').css({height: 'auto'})
        $('.globalNav').removeClass('mobileNavActive');
        $('.item-mobileMenu').attr("aria-expanded","false");
      }
      (!window.requestAnimationFrame) ? setTimeout(updateDropdownPosition, 300) : window.requestAnimationFrame(updateDropdownPosition);
    }
  });

  $('.item-mobileMenu').on('click', function (e) {
    $('body').toggleClass('no-scroll');
    $('.globalNav').toggleClass('mobileNavActive');

    if( $('.globalNav').hasClass('mobileNavActive') ) {
      $(this).attr("aria-expanded","true");
      $('.globalNav').css({
        height: $(window).height() - 18
      })
    } else {
      $('.globalNav').removeAttr('style');
      $(this).attr("aria-expanded","false");
    }
    e.preventDefault();
  })

  $('.mobileContent > div').on('click', function() {
    $(this).parent().siblings().removeClass('active');
    $(this).parent().toggleClass('active');

    if($(this).parent().hasClass('active')) {
      $(this).attr("aria-expanded","true")
      $(this).parent().siblings().find('div').attr("aria-expanded","false");
    }else {
      $(this).attr("aria-expanded", "false")
    }
  })
})