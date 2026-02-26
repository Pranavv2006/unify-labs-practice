async function loadPosts() {
    const res = await fetch('/api/posts');
    const posts = await res.json();
    
    const container = document.getElementById('blog-container');
    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <button onclick="deletePost('${post._id}')">Delete</button>
        </div>
    `).join('');
}

window.onload = loadPosts;