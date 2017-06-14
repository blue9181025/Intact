import Intact from '../src';
import assert from 'assert';
import _ from 'lodash';
import css from './css/animate.css';
import Index from './components/index';
import Detail from './components/detail';
import App from './components/app';

const sEql = assert.strictEqual;
const dEql = assert.deepStrictEqual;

describe('Animate Test', function() {
    var A = Intact.extend({
        defaults: {
            show: true 
        },

        template: Intact.Vdt.compile(`var Animate = self.Animate;
            <Animate><Animate v-if={self.get('show')}>animate</Animate></Animate>
        `, {noWith: true}),

        _mount: function() {
            this.set('show', false);
        }
    });

    it('Animate component render correctly', function() {
        var a = new A();
        a.init();
        sEql(a.element.outerHTML, '<div><div>animate</div></div>');
    });

    it('remove element when animation has completed', function(done) {
        var a = Intact.mount(A, document.body);
        setTimeout(function() {
            sEql(a.element.outerHTML, '<div></div>');
            done();
        }, 500);
    });

    it('animate cross components', (done) => {
        const app = Intact.mount(App, document.body);
        app.load(Index);
        app.load(Detail);
        setTimeout(() => {
            const children = app.element.firstChild.children;
            sEql(children.length, 2);
            sEql(children[0].innerHTML.indexOf('detail-header') > -1, true);
            sEql(children[0].className, '');
            sEql(children[1].innerHTML.indexOf('detail-body') > -1, true);
            sEql(children[1].className, '');
            done();
        }, 500);
    });

    it('should destroy component when leaving', (done) => {
        const app = Intact.mount(App, document.body);
        const _destroy = sinon.spy();
        const C = Intact.extend({
            template: '<span>c</span>',
            _destroy: _destroy
        });
        app.load(Index, {Component: new C()});
        app.load(Detail);
        app.load(Index, {Component: new C()});
        sEql(_destroy.callCount, 1);
        done();
    });

    it('patch between Animate and non-Animate components', (done) => {
        const app = Intact.mount(App, document.body);
        const C = Intact.extend({
            template: `var Animate = self.Animate;
                <Animate>
                    <div key="c-header">c header</div>
                    <Animate key="c-body">c body</Animate>
                </Animate>
            `,
            destroy() {}
        });
        const D = Intact.extend({
            template: `var Animate = self.Animate;
                <Animate>
                    <div key="d-header">d header</div>
                    <div key="d-body">d body</div>
                </Animate>
            `,
            destroy() {}
        });
        app.load(C);
        app.load(D);
        done();
    });
});
