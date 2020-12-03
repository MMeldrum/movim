var Stickers = {
    timer : null,
    stickersPage : 0,

    addSmiley: function(element) {
        Chat.insertAtCursor(element.dataset.emoji);
        Drawer.clear();
    },
    zoom: function(element, jid, pack, value) {
        var zoomed = document.querySelectorAll('.zoomed');

        if (element.classList.contains('zoomed')) {
            Drawer.clear();

            var textarea = document.querySelector('#chat_textarea');
            Stickers_ajaxSend(jid, pack, value, Boolean(textarea.dataset.muc));
        }

        var i = 0;
        while(i < zoomed.length) {
            zoomed[i].classList.remove('zoomed');
            i++;
        }

        element.classList.add('zoomed');
    },
    setEmojisEvent(mid) {
        const emojis = document.querySelectorAll('#emojisearchbar + .emojis img');
        let i = 0;

        while (i < emojis.length) {
            emojis[i].onclick = function() {
                if (mid) {
                    Chat_ajaxHttpDaemonSendReaction(mid, this.dataset.emoji);
                } else {
                    Stickers.addSmiley(this);
                }

                Dialog_ajaxClear();
            }

            i++;
        }
    },
    setGifsSearchEvent() {
        const search = document.querySelector('#gifssearchbar input');
        search.focus();

        search.addEventListener('input', e => {
            clearTimeout(Stickers.timer);

            Stickers.timer = setTimeout(() => {
                const gifs = document.querySelector('#gifs .masonry');
                gifs.innerHTML = '';
                Stickers.stickersPage = 0;

                if (search.value !== '') {
                    document.querySelector('#gifssearchbar span.primary i').innerText = 'autorenew';
                    document.querySelector('#gifssearchbar span.primary').classList.add('spin');
                    Stickers_ajaxHttpSearchGifs(search.value, Stickers.stickersPage);
                }

            }, 400);
        });
    },
    setGifsEvents() {
        if (search.value !== '') {
            document.querySelector('#gifssearchbar span.primary i').innerText = 'search';
            document.querySelector('#gifssearchbar span.primary').classList.remove('spin');
        }

        const gifs = document.querySelectorAll('#gifs video');

        let i = 0;

        while (i < gifs.length) {
            gifs[i].addEventListener('mouseover', e => {
                e.target.play();
            });
            gifs[i].addEventListener('mouseout', e => {
                e.target.pause();
            });
            gifs[i].addEventListener('click', e => {
                Chat_ajaxHttpDaemonSendMessage(
                    Chat.getTextarea().dataset.jid,
                    e.target.src,
                    Boolean(Chat.getTextarea().dataset.muc)
                );

                Drawer.clear();
            }, {once:true});

            i++;
        }
    }
}
