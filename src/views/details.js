import { getById, deleteById, getComments, createComment } from '../api/data.js';
import { getUserData } from '../util.js';
import {html} from '../lib.js';


const detailsTemplate = (game, isOwner, onDelete, comments, canComment, onComment) => html` 
<section id="game-details">
<h1>Game Details</h1>
<div class="info-section">
    <div class="game-header">
        <img class="game-img" src="images/MineCraft.png" />
        <h1>${game.title}</h1>
        <span class="levels">MaxLevel: ${game.maxLevel}</span>
        <p class="type">${game.category}</p>
    </div>

    <p class="text">${game.summary} </p>
     

    <!-- Bonus ( for Guests and Users ) -->
    <div class="details-comments">
        <h2>Comments:</h2>
    ${comments.length == 0 
    ? html`<p class="no-comment">No comments.</p>`
    : html`${comments.map(commentTemplate)}`};
        
    </div>

    <!-- Edit/Delete buttons ( Only for creator of this game )  -->
    <div class="buttons"></div>
    ${isOwner  
        ? html`<a href="/edit/${game._id}" class="button">Edit</a>
        <a @click=${onDelete} href="#" class="button">Delete</a>`
        : null}
    </div>
</div>

<!-- Bonus -->
<!-- Add Comment ( Only for logged-in users, which is not creators of the current game ) -->

${canComment 
? html`<article class="create-comment">
    <label>Add new comment:</label>
    <form @submit=${onComment} class="form">
        <textarea name="comment" placeholder="Comment......"></textarea>
        <input class="btn submit" type="submit" value="Add Comment">
    </form>
</article>`
: null}
</section>`;


const commentTemplate = (object) => html` 
<ul>
<li class="comment">
    <p>${object.comment}</p>
</li>
</ul>`

export async function detailsPage(ctx) {

    const gameId = ctx.params.id;
    const game = await getById(gameId);
    const userData = getUserData();
    const isOwner = userData && game._ownerId == userData.id;
    const canComment = userData && game._ownerId != userData.id;
    const comments = await getComments(gameId);

    ctx.render(detailsTemplate(game, isOwner, onDelete,comments, canComment, onComment));

    async function onDelete() {
        
        const choice = confirm('Are you sure you want to delete?');


        if(choice) {
           await deleteById(gameId);
           ctx.page.redirect('/')
        }
    }

    async function onComment(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const comment = formData.get('comment');

        if (comment === '') {
            return alert('You cannot post an empty comment!');
        }

        await createComment({gameId, comment});
        form.reset();
        ctx.page.redirect(`/details/${gameId}`);
    }
}