import { expect, assert } from 'chai';
import { spy } from 'sinon';
import { Option, some, none } from '../src/Option';

describe('Option', () => {

    describe('isEmpty()', () => {
        it('should return true if the option is $none, false otherwise.', () => {
            let a: Option<string> = none;
            expect(a.isEmpty()).to.be.true;
        });

        it('should return false if the option\'s value is nonempy.', () => {
            let a = some('otherwise');
            expect(a.isEmpty()).to.be.false;
        });
    });

    describe('nonEmpty()', () => {
        it('should return true if the option is not $none', () => {
            let a: Option<string> = some('thing');
            expect(a.nonEmpty()).to.be.true;
        });

        it('should return false if the option is $none', () => {
            let a = none;
            expect(a.nonEmpty()).to.be.false;
        });
    });

    describe('isDefined()', () => {
        it('should return true if the option is an instance of $some.', () => {
            let a: Option<string> = some('something');
            expect(a.isDefined()).to.be.true;
        });

        it('should return false if the option is $none.', () => {
            let a = none;
            expect(a.isDefined()).to.be.false;
        });
    });

    describe('get()', () => {
        it('should return the option\'s value.', () => {
            let a = some('Hello, World!');
            expect(a.get()).to.be.eq('Hello, World!');
        });

        it('should throw RangeError if the option is empty.', () => {
            let a = none;
            expect(a.get).throw(RangeError, 'none.get()');
        });
    });

    describe('getOrElse()', () => {
        it('should return the option\'s value if the option is nonempty.', () => {
            let a = some('something');
            expect(a.getOrElse('otherwise')).to.be.eq('something');
        });

        it('should return "default" if the option is empty.', () => {
            let a = none;
            expect(a.getOrElse('otherwise')).to.be.eq('otherwise');
        });

        it('should return the result of evaluating "default" if the option is empty.', () => {
            let a = none;
            expect(a.getOrElse(() => 'otherwise')).to.be.eq('otherwise');
        });
    });

    describe('orNull()', () => {
        it('should return the option\'s value if it is nonempty, or `null` if it is empty.', () => {
            let a = some('thing');
            expect(a.orNull()).to.be.eq('thing');
        });

        it('should return `null` if it is empty.', () => {
            let a = none;
            expect(a.orNull()).to.be.eq(null);
        });
    });

    describe('map', () => {
        it('should return a $some containing the result of applying $f to this $option\'s value if this $option is nonempty.', () => {
            let a = some('thing');
            assert(a.map(_ =>'some' + _).equals(some('something')));
        });

        it('should return $none if this $option is empty.', () => {
            let a = none;
            assert(a.map(_ =>'some' + _).equals(none));
        });
    });

    describe('fold', () => {
        it('should return the result of applying $f to this $option\'s value if the $option is nonempty.', () => {
            let a = some('thing');
            expect(a.fold(() => 'nothing', _ =>'some' + _)).to.be.eq('something');
        });

        it('should evaluate expression `ifEmpty` if the $option is empty.', () => {
            let a = some('thing');
            expect(a.fold(() => 'nothing', _ =>'some' + _)).to.be.eq('something');
        });
    });

    describe('flatMap', () => {
        it('should return the result of applying $f to this $option\'s value if this $option is nonempty.', () => {
            let a = some('thing');
            let $f = (_: string): Option<string> => _ === 'thing' ? some('something') : none;
            assert(a.flatMap($f).equals(some('something')));
        });

        it('should return $none if this $option is nempty.', () => {
            let a = none;
            let $f = (_: string): Option<string> => some('something');
            assert(a.flatMap($f).equals(none));
        });
    });

    describe('filter', () => {
        it('should return this $option if it is nonempty and applying the predicate $p to this $option\'s value returns true.', () => {
            let a = some(42);
            assert(a.filter(_ => _ === 42).equals(some(42)));
        });

        it('should return this $none if it is nonempty, but applying the predicate $p to this $option\'s value returns false.', () => {
            let a = some(42);
            assert(a.filter(_ => _ === 13).equals(none));
        });

        it('should return this $none if it is empty.', () => {
            let a = none;
            assert(a.filter(_ => true).equals(none));
        });
    });

    describe('filterNot', () => {
        it('should return this $option if it is nonempty and applying the predicate $p to this $option\'s value returns false.', () => {
            let a = some(42);
            assert(a.filterNot(_ => _ === 13).equals(some(42)));
        });

        it('should return $none if it is nonempty, but applying the predicate $p to this $option\'s value returns true.', () => {
            let a = some(42);
            assert(a.filterNot(_ => _ === 42).equals(none));
        });

        it('should return $none if the option\'s value is empty.', () => {
            let a = none;
            assert(a.filterNot(_ => _ === 42).equals(none));
        });
    });

    /*describe('withFilter', () => {
        
    });*/

    describe('contains', () => {
        it('should return true if some instance contains string "something" which equals "something".', () => {
            assert(some('something').contains('something'));
            expect(some('something').contains('something else')).to.be.false;
            expect(none.contains('something')).to.be.false;
            expect(none.contains(none)).to.be.false;
        });
    });

    describe('exists', () => {
        it('should return true if this option is nonempty and the predicate $p returns true when applied to this $option\'s value.', () => {
            assert(some('something').exists(_ => _.length > 0));
        });

        it('should return false if this option is nonempty, but the predicate $p returns false when applied to this $option\'s value.', () => {
            expect(some(42).exists(_ => _ < 42)).to.be.false;
        });
    });

    describe('forall', () => {
        it('should return true if this option is empty.', () => {
            assert(none.forall(_ => _ > 0));
        });

        it('should return true if the predicate $p returns true when applied to this $option\'s value.', () => {
            assert(some(42).forall(_ => _ > 0));
        });

        it('should return false if the predicate $p returns false when applied to this $option\'s value.', () => {
            assert(!some(42).forall(_ => _ > 42));
        });
    });

    describe('foreach', () => {
        it('should apply the given procedure $f to the option\'s value, if it is nonempty. Otherwise, do nothing.', () => {
            let print = spy();
            some(42).foreach(_ => print(_));
            assert(print.calledWith(42));
        });
    });

    describe('orElse()', () => {
        it('should return the option if it\'s is nonempty.', () => {
            let a = some('something');
            assert(a.orElse(none).equals(some('something')));
        });

        it('should return the alternative if the option is empty.', () => {
            let a = none;
            assert(a.orElse(some('something')).equals(some('something')));
        });
    });

    describe('equals()', () => {
        it('should return true if the both options are defined and have equal values.', () => {
            let a = some('thing');
            let b = some('thing');
            assert(a.equals(b));
            assert(b.equals(a));
        });

        it('should return false if the both options are defined, but have nonequal values.', () => {
            let a = some('thing');
            let b = some('another');
            assert(!a.equals(b));
            assert(!b.equals(a));
        });

        it('should return false if one of the options is $none.', () => {
            let a = some('thing');
            let b = none;
            assert(!a.equals(b));
            assert(!b.equals(a));
        });

        it('should return true if both options are $none.', () => {
            let a = none;
            let b = none;
            assert(a.equals(b));
            assert(b.equals(a));
        });
    });

    describe('iterable', () => {
        it('should return only the option\'s value when spread into array.', () => {
            let s = some('thing');
            let [head] = [...s];
            expect(head).to.be.eq('thing');
        });


        it('should return nothing when spread None into array.', () => {
            expect([...none]).to.be.deep.eq([]);
        });

        it('should be nicely iterable in for of', () => {
            let something = some('thing');
            let print = spy();
            for(let thing in something){
                print(thing);
            }
            print.calledWith('thing');
        });
    });
});