pub mod engine;
pub mod image;
pub mod parse;

use std::sync::LazyLock;
use tokio::runtime::Runtime;

static RUNTIME: LazyLock<Runtime> = LazyLock::new(|| {
    Runtime::new().expect(
        "Failed to initialise tokio runtime. \
            Please file this bug at https://github.com/yousefabukar/prototype-design/issues.",
    )
});
