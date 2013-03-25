var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

// Ϊ jQuery ʵ�������ṩ��չ������
// find, has, not, filter, is, closest, index, add, addBack
jQuery.fn.extend({
	find: function( selector ) {
		var i, l, length, n, r, ret,
			self = this;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		ret = this.pushStack( "", "find", selector );

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},
    /**
     * @desc http://api.jquery.com/is/ �漰Sizzle�����ڴ˴η�������
     */
	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

// andSelf �������Ժ� addBack �滻��������ʹ�� addBack��
// �����������ڹٷ� API �ĵ���������ǣ�ǰ�߲����ܲ��������߿�ѡ����һ�����Ҳ���
jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
// ���ĳ���ڵ��Ƿ��� document ��
// DOCUMENT_FRAGMENT_NODE(11)
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}
/**
 * @desc ����ĳ��Ԫ�ص���Ԫ�ػ��Ԫ��
 * @param cur {Element} ������Ԫ��
 * @param dir {string } ���� 'previousSibling' or 'nextSibling'
 * @return {Element}
 */
function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 ); // ELEMENT_NODE(1)

	return cur;
}
// ����Ҫ���巽���Ĳ����б���һ��������ʹ����һ��С���ɣ�����������һ�ѷ���
jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) { // iӦ���Ǻ�������mapʱ�����index������Ŀǰ��û����
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		// �������������� Until ��β�� �� ����
        // ʵȥ��������������������ӵ����ͬ�Ĳ����б�parentsUntil�� prevUntil�� nextUntil
        if ( !runtil.test( name ) ) {
            selector = until;
        }

		/*
		 * ����API�ĵ���ֻ�������� Until ��β�ķ������ܵڶ�������
		 * ���� selector ���������ˣ�filter���õģ�
		 * �������������if�жϣ���ִ�и��߼�
		 */
        if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		// �ο�ģ�鿪ͷ����guaranteedUnique[ name ] Ϊ true �Ŀ�����ֻ��nameΪ children��contents��next��prevʱ
        // �������������ķ������У�parent, parents, parentsUntil, nextAll, prevAll, nextUntil, prevUntil, siblings
        // $.unique ��DOMԪ���������ظ���Ԫ���Ƴ�
        ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		// ƥ�� parents, parentsUntil, prevUntil, prevAll
        // Ϊ�˽��Ԫ�ط����������������ʹ�ã���Խ��������һ������
        if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
    /**
     * @desc
     * @param expr
     * @param elems
     * @param not
     * @return {Array}
     */
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},
    /**
     * @desc ��һ��Ԫ�س�����������������Ԫ�أ�����ȡ�������������ϵ�����Ԫ�أ�ֱ������document���������untilƥ���Ԫ��ֹͣ
     * @param {Element} elem ��ʼԪ��
     * @param {string} dir �����������򣬿�ѡֵ��'parentNode'�� 'nextSibling'�� 'previousSibling'
     * @param {string} until ѡ�������ʽ��������� until ƥ���Ԫ�أ�������ֹ
     * @return {Array}
     */
	dir: function( elem, dir, until ) { // һ���򵥵� dir ������ʹ�ú���֧�ֱ������ȡ��ֳ����ֵ�
		var matched = [],
			cur = elem[ dir ];  // ���� elem ����
        /**
         * �����������򻯣���cur.nodeType !== 9 && !jQuery( cur ).is( until )
         * �������ʣ�ֱ������document���������untilƥ���Ԫ��
         * cur.nodeType !== 9	��ǰDOM�ڵ�cur����document����
         * !jQuery( cur ).is( until )	��ǰDOM�ڵ�cur��ƥ����ʽuntil
         *
         * until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )
         * ����������ʽҲ�е���˼��ִ������jQuery.is�����������ǣ�until !== undefined && cur.nodeType === 1
         * ���ϵĲ������ʽ����Ԫ���ʽ���ܼ��ٴ�����������΢�������ܣ����Ǵ����ɬ�������Ķ���ά����
         * Ҳ������Ҳ��jQuery���ҵ�ԭ��֮һ
         */
        // DOCUMENT_NODE(9)
		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
            if ( cur.nodeType === 1 ) {
                matched.push( cur );
            }
            cur = cur[dir];
        }
		return matched;
	},
    /*
     * @desc ����˵���÷�����ȡԪ�� n �����к����ֵ�Ԫ�أ����� n����������elem
     * @param n {Element} ��ʼ�����Ԫ��
     * @param elem {Element} ������Ԫ��
     * @return {Array} �� n ��ʼֱ�����������е��ֵ�Ԫ�أ����������elem���򲻰��� elem
     */
	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
// ʵ���� filter �� not ͬ�ȵĹ���
// keep ��һ������ֵ
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
